const GlobalGraphConfig = {
	light: {
		chart: {
			type: "areaspline",
			backgroundColor: "#FFFFFF"
		},
		navigation: {
			buttonOptions: {
				symbolStroke: "#1F2937",
				symbolSize: 16,
				theme: {
					fill: "#FFFFFF",
					states: {
						hover: {
							fill: "#C4B5FD"
						},
						select: {
							fill: "#A78BFA"
						}
					}
				}
			},
			menuItemHoverStyle: {
				background: "#8B5CF6",
				color: "#1F2937"
			},
			menuItemStyle: {
				background: "#F9FAFB",
				color: "#1F2937",
				fontSize: "12px"
			},
			menuStyle: {
				background: "#F9FAFB",
				border: "2px solid #E5E7EB",
				borderRadius: "0.5rem"
			}
		},
		navigator: {
			series: {
				type: "areaspline",
				lineColor: "#7C3AED"
			},
			xAxis: {
				type: "datetime",
				labels: {
					style: {
						color: "#374151"
					}
				}
			}
		},
		plotOptions: {
			areaspline: {
				backgroundColor: "transparent",
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
				marker: {
					fillColor: "#F3F4F6",
					lineColor: "#5B21B6",
					lineWidth: 2,
					radius: 4.25
				},
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
				fill: "#E5E7EB",
				stroke: "none",
				"stroke-width": 0,
				r: 4,
				style: {
					color: "#111827",
					fontWeight: "medium"
				},
				states: {
					hover: {
						fill: "#7C3AED",
						style: {
							color: "#F3F4F6"
						}
					},
					select: {
						fill: "#7C3AED",
						style: {
							color: "#E5E7EB"
						}
					},
					disabled: {
						fill: "#6B7280",
						style: {
							color: "#E5E7EB"
						}
					}
				}
			},
			inputStyle: {
				color: "#1F2937",
				fontWeight: "semibold"
			},
			labelStyle: {
				color: "#1F2937"
			}
		},
		xAxis: {
			type: "datetime",
			labels: {
				style: {
					color: "#374151"
				}
			}
		},
		yAxis: {
			labels: {
				style: {
					color: "#374151"
				}
			}
		}
	},
	dark: {
		chart: {
			type: "areaspline",
			backgroundColor: "#111827"
		},
		navigation: {
			buttonOptions: {
				symbolStroke: "#E5E7EB",
				symbolSize: 16,
				theme: {
					fill: "#111827",
					states: {
						hover: {
							fill: "#8B5CF6"
						},
						select: {
							fill: "#7C3AED"
						}
					}
				}
			},
			menuItemHoverStyle: {
				background: "#8B5CF6",
				color: "#E5E7EB"
			},
			menuItemStyle: {
				background: "#1F2937",
				color: "#E5E7EB",
				fontSize: "12px"
			},
			menuStyle: {
				background: "#1F2937",
				border: "2px solid #374151",
				borderRadius: "0.5rem"
			}
		},
		navigator: {
			series: {
				type: "areaspline",
				lineColor: "#7C3AED"
			},
			xAxis: {
				labels: {
					style: {
						color: "#D1D5DB"
					}
				}
			}
		},
		plotOptions: {
			areaspline: {
				backgroundColor: "transparent",
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, "#8B5CF6"],
						[1, "#111827"]
					]
				},
				lineColor: "#7C3AED",
				marker: {
					fillColor: "#F3F4F6",
					lineColor: "#A78BFA",
					lineWidth: 2,
					radius: 4.25
				},
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
			inputStyle: {
				color: "#D1D5DB",
				fontWeight: "semibold"
			},
			labelStyle: {
				color: "#D1D5DB"
			}
		},
		xAxis: {
			type: "datetime",
			labels: {
				style: {
					color: "#D1D5DB"
				}
			}
		},
		yAxis: {
			labels: {
				style: {
					color: "#D1D5DB"
				}
			}
		}
	},
	credits: {
		enabled: false
	},
	responsive: {
		dashboard: {
			rules: [
				{
					condition: {
						maxWidth: 500
					},
					chartOptions: {
						chart: {
							height: 350
						},
						navigator: {
							enabled: false
						}
					}
				},
				{
					condition: {
						minWidth: 600
					},
					chartOptions: {
						chart: {
							height: 400
						},
						navigator: {
							enabled: true
						}
					}
				}
			]
		},
		shoePage: {
			rules: [
				{
					condition: {
						maxWidth: 500
					},
					chartOptions: {
						chart: {
							height: 350
						}
					}
				},
				{
					condition: {
						minWidth: 600
					},
					chartOptions: {
						chart: {
							height: 400
						}
					}
				}
			]
		}
	},
	series: [
		{
			name: "Sale price",
			type: "areaspline",
			data: [0],
			xAxis: 0,
			states: {
				hover: {
					halo: null
				}
			}
		}
	]
};

export const DashboardGraphConfig = {
	light: {
		chart: GlobalGraphConfig.light.chart,
		credits: GlobalGraphConfig.credits,
		navigation: GlobalGraphConfig.light.navigation,
		navigator: GlobalGraphConfig.light.navigator,
		plotOptions: GlobalGraphConfig.light.plotOptions,
		rangeSelector: GlobalGraphConfig.light.rangeSelector,
		responsive: GlobalGraphConfig.responsive.dashboard,
		series: GlobalGraphConfig.series,
		xAxis: GlobalGraphConfig.light.xAxis,
		yAxis: GlobalGraphConfig.light.yAxis
	},
	dark: {
		chart: GlobalGraphConfig.dark.chart,
		credits: GlobalGraphConfig.credits,
		navigation: GlobalGraphConfig.dark.navigation,
		navigator: GlobalGraphConfig.dark.navigator,
		plotOptions: GlobalGraphConfig.dark.plotOptions,
		rangeSelector: GlobalGraphConfig.dark.rangeSelector,
		responsive: GlobalGraphConfig.responsive.dashboard,
		series: GlobalGraphConfig.series,
		xAxis: GlobalGraphConfig.dark.xAxis,
		yAxis: GlobalGraphConfig.dark.yAxis
	}
};

export const ShoePageGraphConfig = {
	light: {
		chart: GlobalGraphConfig.light.chart,
		exporting: {
			enabled: false
		},
		navigator: {
			enabled: false
		},
		plotOptions: GlobalGraphConfig.light.plotOptions,
		rangeSelector: GlobalGraphConfig.light.rangeSelector,
		responsive: GlobalGraphConfig.responsive.shoePage,
		xAxis: GlobalGraphConfig.light.xAxis,
		yAxis: GlobalGraphConfig.light.yAxis,
		series: GlobalGraphConfig.series,
		credits: GlobalGraphConfig.credits
	},
	dark: {
		chart: GlobalGraphConfig.dark.chart,
		credits: GlobalGraphConfig.credits,
		exporting: {
			enabled: false
		},
		navigator: {
			enabled: false
		},
		plotOptions: GlobalGraphConfig.dark.plotOptions,
		rangeSelector: GlobalGraphConfig.dark.rangeSelector,
		responsive: GlobalGraphConfig.responsive.shoePage,
		series: GlobalGraphConfig.series,
		xAxis: GlobalGraphConfig.dark.xAxis,
		yAxis: GlobalGraphConfig.dark.yAxis
	}
};
