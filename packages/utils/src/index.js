export const compareSignatures = (prev, next) => {
	const prevSignature = self.__PREFRESH__.getSignature(prev) || {};
	const nextSignature = self.__PREFRESH__.getSignature(next) || {};

	if (
		prevSignature.key !== nextSignature.key ||
		self.__PREFRESH__.computeKey(prevSignature) !==
			self.__PREFRESH__.computeKey(nextSignature) ||
		nextSignature.forceReset
	) {
		self.__PREFRESH__.replaceComponent(prev, next, true);
	} else {
		self.__PREFRESH__.replaceComponent(prev, next, false);
	}
};

const debounce = fn => {
	let timeout;
	return () => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn();
			timeout = undefined;
		}, 1000 / 60);
	};
};

export const flush = debounce(() => {
	const pending = [...self.__PREFRESH__.getPendingUpdates()];
	self.__PREFRESH__.flush();

	if (pending.length > 0) {
		pending.forEach(([oldType, newType]) => {
			const prevSignature = self.__PREFRESH__.getSignature(oldType) || {};
			const nextSignature = self.__PREFRESH__.getSignature(newType) || {};

			if (
				prevSignature.key !== nextSignature.key ||
				self.__PREFRESH__.computeKey(prevSignature) !==
					self.__PREFRESH__.computeKey(nextSignature) ||
				nextSignature.forceReset
			) {
				self.__PREFRESH__.replaceComponent(oldType, newType, true);
			} else {
				self.__PREFRESH__.replaceComponent(oldType, newType, false);
			}
		});
	}
});

export const isPreactCitizen = name =>
	typeof name === 'string' &&
	name[0](
		(name[0] && name[0] == name[0].toUpperCase()) ||
			(name.startsWith('use') && name[3] && name[3] == name[3].toUpperCase())
	);

export const isCustomHook = name =>
	typeof name === 'string' &&
	name.startsWith('use') &&
	name[3] &&
	name[3] == name[3].toUpperCase();

export const isComponent = name =>
	typeof name === 'string' && name[0] && name[0] == name[0].toUpperCase();
