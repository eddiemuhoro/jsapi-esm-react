import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios';

const MyMap = () => {
  const mapViewRef = useRef(null);

  useEffect(() => {
    // Fetch Sentinel data and process NDVI
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://services.sentinel-hub.com/api/v1/process',
          {
            input: {
              bounds: {
                properties: {
                  crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84',
                },
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [-94.04798984527588, 41.7930725281021],
                      [-94.04803276062012, 41.805773608962869],
                      [-94.06738758087158, 41.805901566741308],
                      [-94.06734466552735, 41.7967199475024],
                      [-94.06223773956299, 41.79144072064381],
                      [-94.0504789352417, 41.791376727347969],
                      [-94.05039310455322, 41.7930725281021],
                      [-94.04798984527588, 41.7930725281021],
                    ],
                  ],
                },
              },
              data: [
                {
                  type: 'sentinel-2-l2a',
                  dataFilter: {
                    timeRange: {
                      from: '2018-10-01T00:00:00Z',
                      to: '2018-12-20T00:00:00Z',
                    },
                  },
                },
              ],
            },
            output: {
              width: 512,
              height: 512,
              responses: [
                {
                  identifier: 'default',
                  format: {
                    type: 'image/jpeg',
                    quality: 80,
                  },
                },
              ],
            },
          },
          {
            headers: {
              Authorization: 'Bearer  ghhg',
              'Content-Type': 'application/json',
            },
          }
        );

        // Processed image data
        const processedImageData = response.data;

        // Load ArcGIS modules
        loadModules(
          [
            'esri/Map',
            'esri/views/MapView',
            'esri/layers/MapImageLayer',
            'esri/widgets/Legend',
          ],
          { css: true }
        ).then(([Map, MapView, MapImageLayer, Legend]) => {
          // Create a map
          const map = new Map({
            basemap: 'gray',
          });

          // Create a map view
          const view = new MapView({
            container: mapViewRef.current,
            map: map,
            center: [-94.055, 41.792],
            zoom: 10,
          });

          // Create a map image layer with the processed image data
          const mapImageLayer = new MapImageLayer({
            url: processedImageData.url, // Replace with the URL of the processed image
          });

          // Add the map image layer to the map
          map.add(mapImageLayer);

          // Create a legend widget and add it to the view
          const legend = new Legend({
            view: view,
            layerInfos: [
              {
                layer: mapImageLayer,
                title: 'NDVI',
              },
            ],
          });
          view.ui.add(legend, 'bottom-right');
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <div ref={mapViewRef} style={{ width: '100%', height: '90vh' }} />;
};

export default MyMap;
