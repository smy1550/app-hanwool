import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { Service } from '../model';
import { JsonResponse } from '../modules/util';
import logger from '../config/logger';
import { ServiceDto } from '../../../shared/dto';

/**
 * @api {post} /service Request Service create
 * @apiName create
 * @apiGroup Service
 *
 * @apiParam {Number} user_id User unique ID.
 *
 * @apiSuccess {Number} service_id service id of the Service.
 * @apiSuccess {String} service_name  service name of the Service.
 * @apiSuccess {Date} create_date create date of the Service.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 200,
 *       "message": "service created(${service_name})"
 *       "result": {
 *                      "service_id": 1,
 *                      "service_name": "woowahan service",
 *                      "create_date": "2020-01-01"
 *                 }
 *     }
 *
 * @apiError NoServiceForUser Service was not found with user_id.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "status": 400,
 *        "message": "no service for user ${user_id}"
 *        "result": {
 *                      "error": "No Service for ${user_id}"
 *                  }
 *     }
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
	const { body } = req;

	try {
		const service = await Service.create(body as any);
		if (service) {
			res
				.status(HttpStatus.CREATED)
				.json(JsonResponse(`service created(${service.service_name})`, service));
		} else {
			res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(JsonResponse('internal server error', null));
		}
	} catch (err) {
		next(err);
	}
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
	const { params } = req;

	try {
		const service = await Service.findById(params as any);
		if (service) {
			res
				.status(HttpStatus.OK)
				.json(JsonResponse(`got service of id ${params.service_id}`, service));
		} else {
			res
				.status(HttpStatus.BAD_REQUEST)
				.json(JsonResponse(`no service of id ${params.service_id}`, null));
		}
	} catch (err) {
		next(err);
	}
};

export default { create, findById };
