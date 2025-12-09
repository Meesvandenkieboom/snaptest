import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Snapchat Automation API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
        },
        accounts: 'GET /accounts',
      },
    };
  }

  @Get('/health')
  getHealthCheck() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
