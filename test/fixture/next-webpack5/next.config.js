const withPrefresh = require('@prefresh/next');
const path = require('path');

const config = {
  webpack5: true,
	webpack(config, { dev, isServer }) {
		const splitChunks = config.optimization && config.optimization.splitChunks;
		if (splitChunks && isServer && splitChunks.cacheGroups) {
			const cacheGroups = splitChunks.cacheGroups;
			const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;

			if (cacheGroups.framework) {
				cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
					test: preactModules
				});
				cacheGroups.commons.name = 'framework';
			} else {
				cacheGroups.preact = {
					name: 'commons',
					chunks: 'all',
					test: preactModules
				};
			}
		}

		// Install webpack aliases:
		const aliases = config.resolve.alias || (config.resolve.alias = {});
		aliases.react = aliases['react-dom'] = 'preact/compat';
		aliases.preact = path.resolve(__dirname, 'node_modules', 'preact');

		// inject Preact DevTools
		if (dev && !isServer) {
			const entry = config.entry;
			config.entry = () =>
				entry().then(entries => {
					entries['main.js'] = ['preact/debug'].concat(
						entries['main.js'] || []
					);
					return entries;
				});
		}

		return config;
	}
};

module.exports = withPrefresh(config);
