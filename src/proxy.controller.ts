import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { reenviar } from './reenviar';

// El gateway solo autentica (401) y reenvía al BFF. Los grupos (403) los decide el BFF.
@Controller()
@UseGuards(JwtAuthGuard)
export class ProxyController {
  private readonly bff: string;

  constructor(config: ConfigService) {
    this.bff = config.getOrThrow<string>('BFF_URL');
  }

  @Get('catalogo')
  listarCatalogo(@Headers('authorization') a: string) {
    return reenviar(this.bff, 'GET', '/catalogo', a);
  }

  @Post('catalogo')
  crearJuego(@Headers('authorization') a: string, @Body() body: unknown) {
    return reenviar(this.bff, 'POST', '/catalogo', a, body);
  }

  @Put('catalogo/:juegoId')
  actualizarJuego(@Headers('authorization') a: string, @Param('juegoId') id: string, @Body() body: unknown) {
    return reenviar(this.bff, 'PUT', `/catalogo/${encodeURIComponent(id)}`, a, body);
  }

  @Post('compras')
  comprar(@Headers('authorization') a: string, @Body() body: unknown) {
    return reenviar(this.bff, 'POST', '/compras', a, body);
  }

  @Get('biblioteca')
  biblioteca(@Headers('authorization') a: string) {
    return reenviar(this.bff, 'GET', '/biblioteca', a);
  }

  @Get('licencias')
  listarLicencias(@Headers('authorization') a: string) {
    return reenviar(this.bff, 'GET', '/licencias', a);
  }

  @Delete('licencias/:licenciaId')
  revocar(@Headers('authorization') a: string, @Param('licenciaId') id: string, @Body() body: unknown) {
    return reenviar(this.bff, 'DELETE', `/licencias/${encodeURIComponent(id)}`, a, body);
  }

  @Get('panel/en-vivo')
  panelEnVivo(@Headers('authorization') a: string) {
    return reenviar(this.bff, 'GET', '/panel/en-vivo', a);
  }
}