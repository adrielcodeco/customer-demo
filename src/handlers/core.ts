import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus'

@ApiTags('Core')
@Controller()
export class Core {
  @Inject()
  private readonly health: HealthCheckService
  @Inject()
  private readonly disk: DiskHealthIndicator
  @Inject()
  private readonly memory: MemoryHealthIndicator

  @HealthCheck()
  @Get('/health')
  healthCheck() {
    return this.health.check([
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
      // () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ])
  }
}
