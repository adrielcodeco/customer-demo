import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { Core } from 'src/handlers/core'
import { Customers } from 'src/handlers/customers'
import { UsecasesModule } from 'src/usecases/usecases.module'

@Module({
  imports: [TerminusModule, UsecasesModule],
  controllers: [Core, Customers],
})
export class HandlersModule {}
