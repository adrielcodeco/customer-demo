import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  BadRequestException,
  Param,
  Post,
  Put,
  UseGuards,
  ConflictException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateCustomerBodyDTO } from 'src/dto/customers/createCustomerBodyDTO'
import { UpdateCustomerBodyDTO } from 'src/dto/customers/updateCustomerBodyDTO'
import { AuthGuard } from 'src/infrastructure/auth.guard'
import { CreateCustomerUsecase } from 'src/usecases/customers/createCustomer'
import { GetCustomerUsecase } from 'src/usecases/customers/getCustomer'
import { UpdateCustomerUsecase } from 'src/usecases/customers/updateCustomer'
import * as CPF from 'cpf'

@ApiTags('Customers')
@UseGuards(AuthGuard)
@Controller('customers')
export class Customers {
  @Inject()
  private readonly createCustomerUsecase: CreateCustomerUsecase
  @Inject()
  private readonly getCustomerUsecase: GetCustomerUsecase
  @Inject()
  private readonly updateCustomerUsecase: UpdateCustomerUsecase

  @Post()
  async createCustomer(@Body() body: CreateCustomerBodyDTO) {
    if (!CPF.isValid('' + body.document)) {
      throw new BadRequestException('request inválida')
    }
    return this.createCustomerUsecase.run(body).catch(err => {
      throw new BadGatewayException('cache indisponível')
    })
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    const item = await this.getCustomerUsecase.run(id ?? '').catch(err => {
      throw new BadGatewayException('cache indisponível')
    })
    if (!item) {
      throw new NotFoundException('cliente inexistente')
    }
    return item
  }

  @Put(':id')
  async updateCustomer(@Param('id') id: string, @Body() body: UpdateCustomerBodyDTO) {
    if (!CPF.isValid('' + body.document)) {
      throw new BadRequestException('request inválida')
    }
    if (body.id !== id) {
      throw new ConflictException('conflito de ID')
    }
    return this.updateCustomerUsecase.run({ id, ...body }).catch(err => {
      if (/Customer .+ not found/.test(err.message)) {
        throw new NotFoundException('cliente inexistente')
      }
      throw new BadGatewayException('cache indisponível')
    })
  }
}
