import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('service');
    });
  });

  describe('GET /api/properties', () => {
    it('should return properties list', async () => {
      const response = await request(app).get('/api/properties');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by district', async () => {
      const response = await request(app).get('/api/properties?district=Kyrenia');
      
      expect(response.status).toBe(200);
      if (response.body.data.length > 0) {
        expect(response.body.data[0].location.district).toBe('Kyrenia');
      }
    });
  });
});

