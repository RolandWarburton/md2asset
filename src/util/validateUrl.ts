const stringIsAValidUrl = (s: string): boolean => {
	try {
		new URL(s);
		return true;
	} catch (err) {
		return false;
	}
};

export default stringIsAValidUrl;
