import { Module } from '@nestjs/common'
import { CustomerRepository } from './customers'

const modules = [CustomerRepository]

@Module({
  providers: modules,
  exports: modules,
})
export class RepositoriesModule {}
