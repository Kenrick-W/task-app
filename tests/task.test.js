const request = require('supertest');
const app = require('../taskApp');

describe('Task API Testing', () => {

    // RESET STATE MANUAL (karena in-memory)
    beforeEach(() => {
        // reset dengan delete semua via internal behavior
    });

    // ================= ROOT TEST =================
    test('GET root endpoint', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBeDefined();
    });

    // ================= UNIT TEST =================

    test('POST berhasil', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ title: 'Belajar' });

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Belajar');
    });

    test('POST gagal tanpa title', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({});

        expect(res.statusCode).toBe(400);
    });

    test('GET tasks kosong atau array', async () => {
        const res = await request(app).get('/tasks');
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('DELETE task tidak ada', async () => {
        const res = await request(app).delete('/tasks/999');
        expect(res.statusCode).toBe(404);
    });

    test('POST banyak task', async () => {
        await request(app).post('/tasks').send({ title: 'A' });
        await request(app).post('/tasks').send({ title: 'B' });

        const res = await request(app).get('/tasks');
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    test('DELETE berhasil', async () => {
        const create = await request(app)
            .post('/tasks')
            .send({ title: 'Hapus saya' });

        const id = create.body.id;

        const res = await request(app).delete(`/tasks/${id}`);
        expect(res.statusCode).toBe(200);
    });

    test('GET setelah tambah', async () => {
        await request(app).post('/tasks').send({ title: 'Test1' });

        const res = await request(app).get('/tasks');
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('POST title string valid', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ title: 'Hello' });

        expect(typeof res.body.title).toBe('string');
    });

    test('ID increment check', async () => {
        const a = await request(app).post('/tasks').send({ title: '1' });
        const b = await request(app).post('/tasks').send({ title: '2' });

        expect(b.body.id).toBeGreaterThan(a.body.id);
    });

    test('DELETE dua kali', async () => {
        const create = await request(app)
            .post('/tasks')
            .send({ title: 'X' });

        const id = create.body.id;

        await request(app).delete(`/tasks/${id}`);
        const res = await request(app).delete(`/tasks/${id}`);

        expect(res.statusCode).toBe(404);
    });

    // ================= INTEGRATION TEST =================

    test('Flow create-get-delete', async () => {
        const create = await request(app)
            .post('/tasks')
            .send({ title: 'Flow' });

        const id = create.body.id;

        const get = await request(app).get('/tasks');
        expect(get.statusCode).toBe(200);

        const del = await request(app).delete(`/tasks/${id}`);
        expect(del.statusCode).toBe(200);
    });

    test('Flow tanpa title gagal', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({});

        expect(res.statusCode).toBe(400);
    });

    test('Flow banyak data', async () => {
        await request(app).post('/tasks').send({ title: 'A' });
        await request(app).post('/tasks').send({ title: 'B' });
        await request(app).post('/tasks').send({ title: 'C' });

        const res = await request(app).get('/tasks');
        expect(res.body.length).toBeGreaterThanOrEqual(3);
    });

    test('Flow delete semua', async () => {
        const create = await request(app)
            .post('/tasks')
            .send({ title: 'Z' });

        const id = create.body.id;

        await request(app).delete(`/tasks/${id}`);

        const res = await request(app).get('/tasks');
        expect(res.statusCode).toBe(200);
    });

});