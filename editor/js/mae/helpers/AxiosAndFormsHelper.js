import formsHelper from './FormsHelper.js';

const axiosInstance = ($this) => ($this.defaults?.adapter ? $this : window.axios);

/*
 * Forms
 */

function axiosFormSubmitData(form, formdata) {
	const axios_instance = axiosInstance(this);
	return axios_instance[form.method](
		form.dataset.axios_action ?? form.action,
		formdata,
	);
}

function axiosFormSubmit(form, submit_name, is_json) {
	const formdata = (
		is_json
			? formsHelper.formJsonEncode
			: formsHelper.formUrlEncode
	)(
		form,
		submit_name,
	);
	return axiosFormSubmitData.call(this, form, formdata);
}

function axiosForm(form, submit_name, is_json) {
	return () => axiosFormSubmit.call(this, form, submit_name, is_json);
}

export default {
	axiosInstance,
	axiosForm,
	axiosFormSubmit,
	axiosFormSubmitData,

	...formsHelper,
};
