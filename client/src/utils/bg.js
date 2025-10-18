export function setBackgroundImage(url) {
	if (!url) return {};
	return {
		backgroundImage: `url(${url})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat'
	};
}


