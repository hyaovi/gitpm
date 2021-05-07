const formUrlEncode = (form, submit_name, exclude_names = []) => Array.from(form.elements)
	.reduce((result, el) => {
		if (!el.checkValidity()) {
			el.reportValidity();
			throw { type: 'validity', el };
		}
		if (el.type == 'radio' && !el.checked) return result;
		// if (el.type == "checkbox" && !el.checked) return result;
		if (el.type == 'button') return result;
		if (submit_name && el.type == 'submit' && el.name != submit_name) return result;
		if (el.name && !exclude_names.includes(el.name)) {
			result.push(
				`${encodeURIComponent(el.name)
					.replace(/%5B/gi, '[')
					.replace(/%5D/gi, ']')
				}=${
					encodeURIComponent(el.value)}`,
			);
		}
		return result;
	}, [])
	.join('&');

const formJsonEncode = (form, submit_name, exclude_names = []) => {
	const node = (to, key, default_value) => {
		const is_array = key === '';
		if (is_array) {
			const keys_exists = Object.keys(to)
				.map((k) => parseInt(k))
				.filter((i) => !isNaN(i));
			key = keys_exists.length ? Math.max(...keys_exists) : 0;
		}
		return to[key] ?? (to[key] = default_value);
	};

	return Array.from(form.elements).reduce((result, el) => {
		if (!el.checkValidity()) {
			el.reportValidity();
			throw { type: 'validity', el };
		}
		if (el.type == 'radio' && !el.checked) return result;
		if (el.type == 'checkbox' && !el.checked) return result;
		if (el.type == 'button') return result;
		if (submit_name && el.type == 'submit' && el.name != submit_name) return result;
		if (el.name && !exclude_names.includes(el.name)) {
			let { name } = el;
			let assign_to = result;
			let key;
			let m;
			const keys = [];

			do {
				m = name.match(/^([^\[]*)\[([^\]]*)\]/);
				if (m) {
					keys.push(m[1]);
					name = name.replace(m[0], m[2]);
				} else {
					keys.push(name);
				}
			} while (m);

			while (keys.length) {
				const is_last = keys.length === 1;
				key = keys.shift();
				if (is_last) node(assign_to, key, el.value);
				else assign_to = node(assign_to, key, {});
			}
		}
		return result;
	}, {});
};

const UrlToObjectName = (url) => new URL(url).pathname.replace(/^(.*\/)(.+)/, '$2');

const ParseInputRules = (rules_str) => rules_str.split('|').reduce((rules, str) => {
	const [name, args_str] = str.split(':', 2);
	const args = [];
	if (typeof args_str === 'string') args.push(...args_str.split(','));
	rules[name] = args.reduce((arr, arg_str, i) => {
		if (!arr.names) arr.names = [];
		if (!arr.named) arr.named = {};
		const m = arg_str.match(/^([a-z0-9_]+)=(.+)$/);
		let val_str = arg_str;
		let val = arg_str;
		let arg_name;
		if (m) {
			arr.names[i] = arg_name = m[1];
			val_str = m[2];
		}
		if (/^\d+$/.test(val_str)) {
			val = parseInt(val_str);
		} else if (/^\d+\.\d+$/.test(val_str)) {
			val = parseFloat(val_str);
		}
		arr[i] = val;
		if (arg_name) {
			arr.named[arg_name] = val;
		}
		return arr;
	}, []);
	return rules;
}, {});

export default {
	UrlToObjectName,
	ParseInputRules,

	formUrlEncode,
	formJsonEncode,
};
