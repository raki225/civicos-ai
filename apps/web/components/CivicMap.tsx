"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { usePreferences } from "@/components/PreferencesProvider";

type Point = { public_id: string; category: string; status: string; priority: string; latitude: number; longitude: number };

export function CivicMap({ points }: { points: Point[] }) {
  const node = useRef<HTMLDivElement>(null);
  const { labelFor, theme } = usePreferences();
  useEffect(() => {
    if (!node.current) return;
    const center: [number, number] = points.length
      ? [points[0].longitude, points[0].latitude]
      : [78.4867, 17.385];
    const map = new maplibregl.Map({
      container: node.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center,
      zoom: 11,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    points.forEach((point) => {
      const marker = document.createElement("button");
      marker.className = `map-marker priority-${point.priority}`;
      marker.setAttribute("aria-label", `${labelFor(point.category)} — ${labelFor(point.priority)}`);
      new maplibregl.Marker({ element: marker })
        .setLngLat([point.longitude, point.latitude])
        .setPopup(new maplibregl.Popup({ offset: 16 }).setHTML(`<strong>${point.category.replaceAll("_", " ")}</strong><br/>${point.public_id}<br/>${point.status.replaceAll("_", " ")}`))
        .addTo(map);
    });
    return () => map.remove();
  }, [points, labelFor, theme]);
  return <div className="civic-map" ref={node} aria-label="Privacy-safe incident map" />;
}

