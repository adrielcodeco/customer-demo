import { Module } from '@nestjs/common'
import { CreateCustomerUsecase } from './customers/createCustomer'
import { GetCustomerUsecase } from './customers/getCustomer'
import { UpdateCustomerUsecase } from './customers/updateCustomer'
import { RepositoriesModule } from 'src/repositories/repositories.module'

const usecases = [CreateCustomerUsecase, GetCustomerUsecase, UpdateCustomerUsecase]

@Module({
  imports: [RepositoriesModule],
  providers: usecases,
  exports: usecases,
})
export class UsecasesModule {}
