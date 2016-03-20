define({ "api": [
  {
    "type": "get",
    "url": "/months/{interval}/districts/{district_id} Single District",
    "title": "Time series for a single district",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://api.nightlights.io/months/1993.3-1993.4/districts/gujarat-anand",
        "type": "curl"
      }
    ],
    "group": "districts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "district_id",
            "description": "<p>District id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "interval",
            "description": "<p>Time span, in the form <code>'yyyy.mm-yyyy.mm'</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>Time series data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.key",
            "description": "<p>Identifier of geographical area</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.year",
            "description": "<p>Year of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.month",
            "description": "<p>Month of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.satellite",
            "description": "<p>Satellite that took measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.count",
            "description": "<p>Number of measurements in this month</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_median",
            "description": "<p>Average median of measurements for this month</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.quintile1-4",
            "description": "<p>Quintile of measurements for this month</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"key\": \"gujarat-anand\",\n    \"year\": 1993,\n    \"month\": 4,\n    \"satellite\": \"F10\",\n    \"count\": 7529,\n    \"vis_median\": \"6.0000\",\n    \"quintile1\": \"4.0000\",\n    \"quintile2\": \"5.0000\",\n    \"quintile3\": \"7.0000\",\n    \"quintile4\": \"9.0000\"\n  }, ...",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/timeseries.js",
    "groupTitle": "districts",
    "name": "GetMonthsIntervalDistrictsDistrict_idSingleDistrict"
  },
  {
    "type": "get",
    "url": "/months/{interval}/states/{state_id}/districts All Districts",
    "title": "Time series for all districts in a state",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://api.nightlights.io/months/1993.3-1993.4/states/gujarat/districts",
        "type": "curl"
      }
    ],
    "group": "districts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state_id",
            "description": "<p>State id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "interval",
            "description": "<p>Time span, in the form <code>'yyyy.mm-yyyy.mm'</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "result.quintile1-4",
            "description": "<p>Quintile values for the median</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>Time series data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.key",
            "description": "<p>Identifier of geographical area</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.year",
            "description": "<p>Year of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.month",
            "description": "<p>Month of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.satellite",
            "description": "<p>Satellite that took measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.count",
            "description": "<p>Number of measurements in this month</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_median",
            "description": "<p>Average median of measurements for this month</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "example response",
          "content": "http/1.1 200 ok\n[{\n  \"key\": \"gujarat-anand\",\n  \"year\": 1993,\n  \"month\": 4,\n  \"satellite\": \"f10\",\n  \"count\": 7529,\n  \"vis_median\": \"6.0000\"\n}, ...",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/timeseries.js",
    "groupTitle": "districts",
    "name": "GetMonthsIntervalStatesState_idDistrictsAllDistricts"
  },
  {
    "type": "get",
    "url": "/regions",
    "title": "List of all the regions (districts) with display name and id",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://api.nightlights.io/regions",
        "type": "curl"
      }
    ],
    "group": "regions",
    "version": "0.0.0",
    "filename": "routes/regions.js",
    "groupTitle": "regions",
    "name": "GetRegions"
  },
  {
    "type": "get",
    "url": "/months/{interval}/states All States",
    "title": "Time series for all states in the nation.",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://api.nightlights.io/months/1993.3-1993.4/states",
        "type": "curl"
      }
    ],
    "group": "states",
    "success": {
      "examples": [
        {
          "title": "example response",
          "content": "http/1.1 200 ok\n[{\n  \"key\": \"gujarat\",\n  \"year\": 1993,\n  \"month\": 4,\n  \"satellite\": \"f10\",\n  \"count\": 394799,\n  \"vis_median\": \"5.0000\"\n}, ...",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>Time series data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.key",
            "description": "<p>Identifier of geographical area</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.year",
            "description": "<p>Year of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.month",
            "description": "<p>Month of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.satellite",
            "description": "<p>Satellite that took measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.count",
            "description": "<p>Number of measurements in this month</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_median",
            "description": "<p>Average median of measurements for this month</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/timeseries.js",
    "groupTitle": "states",
    "name": "GetMonthsIntervalStatesAllStates",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "interval",
            "description": "<p>Time span, in the form <code>'yyyy.mm-yyyy.mm'</code></p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/months/{interval}/states/{state_id} Single State",
    "title": "Time series for the given state.",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://api.nightlights.io/months/1993.3-1993.4/states/gujarat",
        "type": "curl"
      }
    ],
    "group": "states",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state_id",
            "description": "<p>State id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "interval",
            "description": "<p>Time span, in the form <code>'yyyy.mm-yyyy.mm'</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "example response",
          "content": "http/1.1 200 ok\n[{\n  \"key\": \"gujarat\",\n  \"year\": 1993,\n  \"month\": 4,\n  \"satellite\": \"f10\",\n  \"count\": 394799,\n  \"vis_median\": \"5.0000\"\n}, ...",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>Time series data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.key",
            "description": "<p>Identifier of geographical area</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.year",
            "description": "<p>Year of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.month",
            "description": "<p>Month of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.satellite",
            "description": "<p>Satellite that took measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.count",
            "description": "<p>Number of measurements in this month</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_median",
            "description": "<p>Average median of measurements for this month</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/timeseries.js",
    "groupTitle": "states",
    "name": "GetMonthsIntervalStatesState_idSingleState"
  },
  {
    "type": "get",
    "url": "/months/{interval}/villages/{village_ids} List of Villages",
    "title": "Time series for comma separated list of villages",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://api.nightlights.io/months/1993.3-1993.4/villages/104000100132900,104000200153500,108000200308200",
        "type": "curl"
      }
    ],
    "group": "villages",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of villages and properties</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.villagecode",
            "description": "<p>Village Identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.year",
            "description": "<p>Year of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.month",
            "description": "<p>Month of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.satellite",
            "description": "<p>Satellite that took measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.count",
            "description": "<p>Number of measurements for this period</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_mean",
            "description": "<p>Mean of measurements</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_sd",
            "description": "<p>Stdev of measurements</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_min",
            "description": "<p>Minimum of measurements</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_median",
            "description": "<p>Median of measurements</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "result.vis_max",
            "description": "<p>Maximum of measurements</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "example response",
          "content": "http/1.1 200 ok\n[{\n  \"villagecode\": \"104000100132900\",\n  \"year\": 1993,\n  \"month\": 3,\n  \"satellite\": \"F10\",\n  \"count\": 19,\n  \"vis_mean\": \"4.5263\",\n  \"vis_sd\": \"4.0190\",\n  \"vis_min\": \"0.0000\",\n  \"vis_median\": \"4.0000\",\n  \"vis_max\": \"14.0000\"\n}, ...",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/time-series-villages.js",
    "groupTitle": "villages",
    "name": "GetMonthsIntervalVillagesVillage_idsListOfVillages"
  }
] });
