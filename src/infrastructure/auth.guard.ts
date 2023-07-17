import {
  BadGatewayException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { Configurations } from './configurations'

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private readonly configService: ConfigService<Configurations>

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(headers)
    if (!token) {
      throw new UnauthorizedException('não autorizado')
    }
    const { data } = await axios({
      method: 'POST',
      url: this.configService.get('AUTH_INTROSPECTION_URL'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        client_id: this.configService.get('AUTH_CLIENT_ID'),
        client_secret: this.configService.get('AUTH_CLIENT_SECRET'),
        scope: 'openid',
        token,
      },
      validateStatus: status => status >= 200 && status < 400,
    }).catch(() => {
      throw new BadGatewayException('sso indisponível')
    })
    if (!data?.active) {
      throw new UnauthorizedException('não autorizado')
    }
    return true
  }

  private extractTokenFromHeader(headers: Record<string, string>): string | undefined {
    const [type, token] = headers?.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
