import { BadRequestException, Injectable } from '@nestjs/common';
import { PokeResult } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>,
    private readonly http: FetchAdapter,
  ) {}

  async generate() {
    await this.pokemonModel.deleteMany();
    const resp = await this.http.get<PokeResult>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokes = resp.results.map(({ name, url }) => {
      const segs = url.split('/');
      const no = +segs[+segs.length - 2];
      const poke = {
        name,
        no,
      };
      return poke;
    });

    try {
      const result = await this.pokemonModel.insertMany(pokes, {
        ordered: false,
        rawResult: true,
      });

      return `Se han insertado ${result.insertedCount}`;
    } catch {
      throw new BadRequestException('Fallo al insertar los Datos');
    }
  }
}
