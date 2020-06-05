import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'
import multer from 'multer';

import configMulter from './config/multer';
import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';


const routes = Router();
const upload = multer(configMulter);

const pointsController = new PointsController;
const itemsController = new ItemsController;

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      logintude: Joi.number().required(),
      items: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }),
  pointsController.create
);

export default routes;