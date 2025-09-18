import { Injectable } from '@nestjs/common';
import { PokeResult } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  async generate() {
    const result = await fetch('https://pokeapi.co/api/v2/pokemon?limit=3');
    const resp = (await result.json()) as PokeResult;

    resp.results.forEach(({ name, url }) => {
      const segs = url.split('/');
      const no = +segs[+segs.length - 2];
      const poke = {
        name,
        no,
      };
      console.log(poke);
    });

    return resp.results;
  }
}
