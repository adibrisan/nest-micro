import {
  CreateProductRequest,
  GrpcLogginInterceptor,
  ProductsServiceController,
  ProductsServiceControllerMethods,
} from '@jobster/grpc';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller()
@ProductsServiceControllerMethods()
@UseInterceptors(GrpcLogginInterceptor)
export class ProductsController implements ProductsServiceController {
  constructor(private readonly productsService: ProductsService) {}

  createProduct(request: CreateProductRequest) {
    return this.productsService.createProduct(request);
  }
}
