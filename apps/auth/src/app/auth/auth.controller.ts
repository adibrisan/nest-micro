import { UsersService } from './../users/users.service';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from 'libs/grpc/src/lib/types/proto/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenPayload } from './token-payload.interface';
import { GrpcLogginInterceptor } from '@jobster/grpc';

@Controller()
@AuthServiceControllerMethods()
@UseInterceptors(GrpcLogginInterceptor)
export class AuthController implements AuthServiceController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  authenticate(
    request: AuthenticateRequest & { user: TokenPayload }
  ): Promise<User> | Observable<User> | User {
    return this.usersService.getUser({ id: request.user.userId });
  }
}
