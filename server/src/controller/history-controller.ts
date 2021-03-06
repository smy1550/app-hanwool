import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { History } from '../model';
import { JsonResponse } from '../modules/util';
import { AddHistoryDto } from '@shared/dto/history-dto';
import CustomError from '../exception/custom-error';
import { HistoryDto } from '@shared/dto';

/**
 * @api {post} /api/history
 * @apiName Request creating history
 * @apiGroup History
 *
 * @apiSuccess {Number} service_id service id of the Service.
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
	//TODO validate body
	const dto: AddHistoryDto = {
		service_id: body.service_id,
		price: body.price,
		content: body.content,
		history_date: body.history_date,
		category_id: body.category_id,
		payment_id: body.payment_id,
	};

	try {
		const history = await History.create(dto);
		if (history) {
			res
				.status(HttpStatus.CREATED)
				.json(JsonResponse(`history created(${history.content})`, history));
		} else {
			res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(JsonResponse('internal server error', null));
		}
	} catch (err) {
		next(err);
	}
};

const findByMonth = async (req: Request, res: Response, next: NextFunction) => {
	// params: { serviceId: '1', year: '2020', month: '8' }

	const params = req.params;
	const findArgs = {
		serviceId: parseInt(params.serviceId),
		year: parseInt(params.year),
		month: parseInt(params.month),
	};
	try {
		const history = await History.findByMonth(findArgs);
		res
			.status(HttpStatus.OK)
			.json(JsonResponse(`got histories by month ${req.params.year}-${req.params.month}`, history));
	} catch (err) {
		next(err);
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	const params = req.params;
	const { body } = req;
	const historyId = parseInt(params.id);
	if (isNaN(historyId)) next(new Error('history id is not a number'));

	const editArgs: HistoryDto.EditHistoryDto = {
		content: body.content,
		payment_id: body.payment,
		category_id: body.category,
		price: body.price,
		history_date: body.historyDate,
	};

	for (const key in editArgs) {
		if (editArgs[key] === undefined) delete editArgs[key];
	}

	let history;
	try {
		history = await History.update(historyId, editArgs);
	} catch (err) {
		next(err);
	}
	res.status(HttpStatus.OK).json(JsonResponse(`updated history ${body.history_id}`, history));
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
	const params = req.params;
	const historyId = parseInt(params.id);
	if (isNaN(historyId)) next(new Error('history id is not a number'));

	let history;
	try {
		await History.remove(historyId);
	} catch (err) {
		throw new CustomError(HttpStatus.BAD_REQUEST, `Error while removing history`);
	}
	res.status(HttpStatus.OK).json(JsonResponse(`removed history ${historyId}`, history));
};

const bulkInsert = async (req: Request, res: Response, next: NextFunction) => {
	const { data } = req.body;
	try {
		const { insertId, affectedRows } = await History.bulkInsert(data);
		res
			.status(HttpStatus.CREATED)
			.json(
				JsonResponse(`histories bulk insert success: ${affectedRows}`, { insertId, affectedRows })
			);
	} catch (err) {
		next(err);
	}
};

export default { create, findByMonth, update, remove, bulkInsert };
