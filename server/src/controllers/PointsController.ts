import { Request, Response } from 'express';
import knex from '../database/Connection';
import os from 'os';
import dns from 'dns';

var ip = '';
dns.lookup(os.hostname(), { family: 0 }, (err, add, fam) => {
  ip = add
})

class PointsController {
  async index(request: Request, response: Response){
    const { city, uf, items } = request.query;

    if(items) var parsedItems = String(items).split(',').map(item => Number(item.trim()))
    else var parsedItems = [1, 2, 3, 4, 5, 6]

    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    const serializedPoints = points.map(point => ({ ...point, image: `http://${ip}:3333/uploads/${point.image}`}))

    return response.json(serializedPoints)
  }

  async show(request: Request, response: Response){
    const { id } = request.params;
    const point = await knex('points').select('*').where('id', id).first();

    if(!point) return response.status(400).json({message: 'Point Not Found'});

    let items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id);

    items = items.map(item => ({ ...item, image: `http://${ip}:3333/uploads/${item.image}`}))

    return response.json({ ...point, items, image: `http://${ip}:3333/uploads/${point.image}`})
  }

  async create(request: Request, response: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;
    const point = { name, email, whatsapp, latitude, longitude, city, uf, image: request.file.filename };

    const trx = await knex.transaction();
    const insertedIds = await trx('points').insert(point)
    const point_id = insertedIds[0];

    const pointItems = items
        .split(',')
        .map((item:string) => Number(item.trim()))
        .map((item_id: number) => { return { point_id: point_id, item_id }
    })

    await trx('points_items').insert(pointItems)
    await trx.commit()

    return response.json({ id:point_id , ...point})
  }
}

export default PointsController;