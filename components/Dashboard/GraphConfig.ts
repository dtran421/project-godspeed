export const DashboardGraphConfig = {
	chart: {
		type: "areaspline"
	},
	title: {
		text: "Watchlist Performance"
	},
	subtitle: {
		text: ""
	},
	plotOptions: {
		areaspline: {
			backgroundColor: "transparent",
			color: "#3B82F6",
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, "#8B5CF6"],
					[1, "#FFFFFF"]
				]
			},
			lineColor: "#7C3AED",
			tooltip: {
				split: false,
				pointFormat: "{series.name}: {point.y}",
				valueDecimals: 2,
				valuePrefix: "$",
				xDateFormat: "%b %e, %Y"
			}
		}
	},
	xAxis: {
		type: "datetime"
	},
	series: [
		{
			name: "Sale price",
			type: "areaspline",
			data: [0],
			xAxis: 0,
			states: {
				hover: {
					halo: {
						size: 8,
						attributes: {
							fill: "#7C3AED",
							stroke: "#000000",
							"stroke-width": 2
						}
					}
				}
			}
		}
	],
	credits: {
		enabled: false
	}
};

export const ShoePageGraphConfig = {
	chart: {
		type: "areaspline",
		backgroundColor: null,
		width: 1200
	},
	exporting: {
		enabled: false
	},
	navigator: {
		enabled: false
	},
	plotOptions: {
		areaspline: {
			color: "#3B82F6",
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, "#8B5CF6"],
					[1, "#FFFFFF"]
				]
			},
			lineColor: "#7C3AED",
			tooltip: {
				split: false,
				pointFormat: "{series.name}: {point.y}",
				valueDecimals: 2,
				valuePrefix: "$",
				xDateFormat: "%b %e, %Y"
			}
		}
	},
	rangeSelector: {
		buttonTheme: {
			fill: "#374151",
			stroke: "none",
			"stroke-width": 0,
			r: 4,
			style: {
				color: "#D1D5DB",
				fontWeight: "medium"
			},
			states: {
				hover: {
					fill: "#7C3AED"
				},
				select: {
					fill: "#7C3AED",
					style: {
						color: "#D1D5DB"
					}
				},
				disabled: {
					fill: "#000000",
					style: {
						color: "#6B7280"
					}
				}
			}
		},
		labelStyle: {}
	},
	xAxis: {
		type: "datetime"
	},
	series: [
		{
			name: "Sale price",
			type: "areaspline",
			data: [0],
			xAxis: 0,
			states: {
				hover: {
					halo: {
						size: 8,
						attributes: {
							fill: "#7C3AED",
							stroke: "#000000",
							"stroke-width": 2
						}
					}
				}
			}
		}
	],
	credits: {
		enabled: false
	}
};
