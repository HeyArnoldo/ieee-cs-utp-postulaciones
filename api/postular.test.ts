import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock openai BEFORE importing handler
const mockOpenAICreate = vi.fn();
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: mockOpenAICreate } },
  })),
}));

// Mock @notionhq/client BEFORE importing handler
vi.mock('@notionhq/client', () => {
  const mockCreate = vi.fn();
  return {
    Client: vi.fn().mockImplementation(() => ({
      pages: { create: mockCreate },
      blocks: { children: { append: vi.fn().mockResolvedValue({}) } },
    })),
    __mockCreate: mockCreate,
  };
});

// Helper to get the mock
async function getNotionMock() {
  const mod = await import('@notionhq/client');
  return (mod as unknown as { __mockCreate: ReturnType<typeof vi.fn> }).__mockCreate;
}

const validBody = {
  name: 'Ana Pérez López',
  career: 'sistemas',
  cycle: '4-6',
  interest: 'web',
  motivation: 'Quiero aprender y crecer en el mundo de la tecnología con IEEE CS.',
  availability: '5-8',
  contact: { email: 'ana@gmail.com', whatsapp: '912345678' },
};

function makeReq(method: string, body?: unknown): VercelRequest {
  return { method, body } as unknown as VercelRequest;
}

function makeRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as VercelResponse & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

describe('POST /api/postular', () => {
  let handler: (req: VercelRequest, res: VercelResponse) => Promise<void>;

  beforeEach(async () => {
    vi.resetModules();
    mockOpenAICreate.mockReset();
    // Set env vars
    process.env.NOTION_TOKEN = 'test-token';
    process.env.NOTION_DATABASE_ID = 'test-db-id';
    const mod = await import('./postular');
    handler = mod.default;
  });

  it('returns 405 for GET requests', async () => {
    const req = makeReq('GET');
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('returns 400 for invalid body', async () => {
    const req = makeReq('POST', { name: 'only-name' });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(jsonArg).toHaveProperty('ok', false);
    expect(jsonArg).toHaveProperty('issues');
  });

  it('returns 500 if NOTION_TOKEN is missing', async () => {
    delete process.env.NOTION_TOKEN;
    const req = makeReq('POST', validBody);
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(jsonArg).toHaveProperty('ok', false);
    expect(jsonArg.error).toMatch(/config/i);
  });

  it('returns 500 if NOTION_DATABASE_ID is missing', async () => {
    delete process.env.NOTION_DATABASE_ID;
    const req = makeReq('POST', validBody);
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('calls notion.pages.create and returns 200 on success', async () => {
    const mockCreate = await getNotionMock();
    mockCreate.mockResolvedValueOnce({ id: 'new-page-id' });
    const req = makeReq('POST', validBody);
    const res = makeRes();
    await handler(req, res);
    expect(mockCreate).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(jsonArg).toMatchObject({ ok: true, pageId: 'new-page-id' });
  });

  it('returns 502 when notion client throws', async () => {
    const mockCreate = await getNotionMock();
    mockCreate.mockRejectedValueOnce(new Error('Notion API error'));
    const req = makeReq('POST', validBody);
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(502);
    const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(jsonArg).toHaveProperty('ok', false);
    expect(jsonArg).toHaveProperty('error');
  });

  describe('AI enrichment — never blocks Notion save', () => {
    it('creates Notion page and returns 200 with fallback when OpenAI throws', async () => {
      const mockCreate = await getNotionMock();
      mockCreate.mockResolvedValueOnce({ id: 'page-ai-fallback' });
      mockOpenAICreate.mockRejectedValueOnce(new Error('OpenAI network error'));
      const req = makeReq('POST', validBody);
      const res = makeRes();
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(jsonArg).toMatchObject({ ok: true, pageId: 'page-ai-fallback', fallback: true });
      expect(jsonArg.mensaje).toBeTruthy();
    });

    it('returns mensaje + comiteSugerido + lineaSugerida on AI success', async () => {
      const mockCreate = await getNotionMock();
      mockCreate.mockResolvedValueOnce({ id: 'page-ai-success' });
      mockOpenAICreate.mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({
              mensaje: 'Excelente perfil, bienvenido al proceso.',
              comiteSugerido: 'Comité de Tecnología e Información (TI)',
              lineaSugerida: ['IA'],
              resumenRRHH: 'Candidato motivado con interés en IA.',
            }),
          },
        }],
      });

      const req = makeReq('POST', validBody);
      const res = makeRes();
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(jsonArg).toMatchObject({ ok: true, pageId: 'page-ai-success' });
      expect(jsonArg.mensaje).toBeTruthy();
      expect(jsonArg.comiteSugerido).toBe('Comité de Tecnología e Información (TI)');
      expect(jsonArg.lineaSugerida).toContain('IA');
    });
  });
});
