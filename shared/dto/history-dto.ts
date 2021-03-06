type History = {
	id: number;
	price: number;
	content: string;
	historyDate: Date;
	category: string;
	payment: string;
};

type CREATE = {
	price: number;
	content: string;
	history_date: Date;
	category_id: number;
	payment_id: number;
	service_id: number;
};

type AddHistoryDto = {
	service_id: number;
	price: number;
	content: string;
	history_date: string;
	category_id: number;
	payment_id: number;
};

type EditHistoryDto = {
	price?: number;
	content?: string;
	history_date?: string;
	category_id?: number;
	payment_id?: number;
};
type GET_DATA = {
	service_id: number;
	startDate: Date;
	endDate: Date;
};

type UPDATE = {
	history_id: number;
	price: number;
	content: string;
	historyDate: Date;
	category_id: number;
	payment_id: number;
	service_id: number;
};

type REMOVE = {
	history_id: number;
};

export { History, AddHistoryDto, EditHistoryDto, GET_DATA, UPDATE, REMOVE, CREATE };
