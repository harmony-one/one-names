require('dotenv').config()
const webpack = require('webpack')

module.exports = {
	ssr: false,

	/*
	 ** Headers of the page
	 */
	head: {
		title: 'OneNames',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'OneNames.' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Overpass:100,200,300,400,600,700,800,900|Overpass+Mono:300,400'
			},
			{
				rel: 'stylesheet',
				href:
					'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
			}
		]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#1946FF' },
	/*
	 ** Global CSS
	 */
	css: [],

	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [{ src: './plugins/subdomain.js' }],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: [],

	/*
	 ** Nuxt.js modules
	 */
	modules: [
		'@nuxtjs/axios'
	],

	serverMiddleware: [
		{ path: '/api', handler: '~/server-middleware/api.js' }
	],

	/*
	 ** Build configuration
	 */
	build: {
		collapseBooleanAttributes: true,
		decodeEntities: true,
		minifyCSS: true,
		minifyJS: true,
		processConditionalComments: true,
		removeEmptyAttributes: true,
		removeRedundantAttributes: true,
		trimCustomFragments: true,
		useShortDoctype: true,
		extractCSS: true,
		extend(config, ctx) {},
		plugins: [
			new webpack.ProvidePlugin({
				_: 'lodash'
			})
		]
	},
	srcDir: 'src/',
	rootDir: './'
}
