// Auto-generated live engineering pipeline payloads
export const HEALTH = {
  "status": "ready",
  "version": "0.1.0-mvp",
  "environment": "production",
  "engineer_disclaimer": "ALL GEOMETRY & RATES TO BE CONFIRMED BY A REGISTERED ENGINEER",
  "rules_sha256": "3501ae7257a11e03880544f101e8b91664e32aaea6e78990b9230727ae31b916"
};

export const PROJECTS = [
  {
    "id": "proj-lifidi-001",
    "name": "Lifidi - Piapung Road Corridor (19.50km)",
    "description": "Pilot rural access and arterial corridor design under Mastodon Engineering Services agreement.",
    "created_by_user_id": "dev-engineer-001",
    "created_at": "2026-11-05T16:29:09.379916",
    "updated_at": "2026-11-05T16:29:09.379916"
  }
];

export const PROJECT_DETAIL = {
  "id": "proj-lifidi-001",
  "name": "Lifidi - Piapung Road Corridor (19.50km)",
  "description": "Pilot rural access and arterial corridor design under Mastodon Engineering Services agreement.",
  "created_by_user_id": "dev-engineer-001",
  "created_at": "2026-11-05T16:29:09.379916",
  "updated_at": "2026-11-05T16:29:09.379916",
  "surveys": [
    {
      "id": "3dbebe86-a1cc-4088-aff4-e79b66f82dde",
      "original_filename": "slope.csv",
      "file_format": "CSV",
      "sha256_hash": "e59c712d2040455abbae50465ffc229ca736a5aec7da458837c2b985c00d388d",
      "file_size_bytes": 9434,
      "point_count": 287,
      "density_pts_m2": 0.04783333333333333,
      "status": "VALIDATED",
      "uploaded_at": "2026-11-05T16:33:57.348941"
    }
  ],
  "runs": [
    {
      "id": "19790393-8180-4d71-9386-ecb7eb30b258",
      "survey_file_id": "3dbebe86-a1cc-4088-aff4-e79b66f82dde",
      "status": "COMPLETED",
      "execution_duration_sec": 0.4299,
      "total_road_length_m": 200.0,
      "total_cut_volume_m3": 138.2,
      "total_fill_volume_m3": 0.0,
      "net_volume_m3": 138.2,
      "created_at": "2026-11-05T16:33:57.984735",
      "completed_at": "2026-11-05T16:33:57.978481"
    }
  ]
};

export const ALIGNMENT = {
  "start_point": [
    100000.0,
    200000.0
  ],
  "end_point": [
    100200.0,
    200000.0
  ],
  "total_length_m": 200.0,
  "station_interval_m": 20.0,
  "design_speed_kph": 60.0,
  "min_radius_m": 150.0,
  "max_allowable_ground_grade_percent": 12.0,
  "max_detected_ground_grade_percent": 2.0,
  "is_grade_compliant": true,
  "curves": [],
  "stations": [
    {
      "station_m": 0.0,
      "x": 100000.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 300.0,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 20.0,
      "x": 100020.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 300.4,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 40.0,
      "x": 100040.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 300.8,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 60.0,
      "x": 100060.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 301.2,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 80.0,
      "x": 100080.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 301.6,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 100.0,
      "x": 100100.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 302.0,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 120.0,
      "x": 100120.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 302.4,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 140.0,
      "x": 100140.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 302.8,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 160.0,
      "x": 100160.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 303.2,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 180.0,
      "x": 100180.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 303.6,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    },
    {
      "station_m": 200.0,
      "x": 100200.0,
      "y": 200000.0,
      "bearing_deg": 90.0,
      "ground_z": 304.0,
      "segment_type": "TANGENT",
      "tangent_dx": 1.0,
      "tangent_dy": 0.0
    }
  ],
  "summary_text": "Horizontal Alignment: Total length = 200.00m. Straight tangent alignment. GRADE COMPLIANT: Maximum terrain grade is 2.00% (limit: 12.0%). Stationing interval = 20.0m (11 stations generated).",
  "engineer_notice": "ALIGNMENT GEOMETRY GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
};

export const PROFILE = {
  "total_length_m": 200.0,
  "station_interval_m": 20.0,
  "min_allowable_grade_percent": 0.5,
  "max_allowable_grade_percent": 8.0,
  "max_detected_design_grade_percent": 2.0,
  "max_cut_depth_m": 0.0,
  "max_fill_depth_m": 0.0,
  "mean_cut_depth_m": 0.0,
  "mean_fill_depth_m": 0.0,
  "is_grade_compliant": true,
  "pvis": [
    {
      "station_m": 0.0,
      "elevation_m": 300.0,
      "grade_in_percent": null,
      "grade_out_percent": 2.0,
      "curve_length_m": 0.0,
      "pvc_station_m": null,
      "pvt_station_m": null,
      "k_value": null,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 200.0,
      "elevation_m": 304.0,
      "grade_in_percent": 2.0,
      "grade_out_percent": null,
      "curve_length_m": 0.0,
      "pvc_station_m": null,
      "pvt_station_m": null,
      "k_value": null,
      "curve_type": "TANGENT"
    }
  ],
  "profile_points": [
    {
      "station_m": 0.0,
      "ground_elevation_m": 300.0,
      "design_elevation_m": 300.0,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 20.0,
      "ground_elevation_m": 300.4,
      "design_elevation_m": 300.4,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 40.0,
      "ground_elevation_m": 300.8,
      "design_elevation_m": 300.8,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 60.0,
      "ground_elevation_m": 301.2,
      "design_elevation_m": 301.2,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 80.0,
      "ground_elevation_m": 301.6,
      "design_elevation_m": 301.6,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 100.0,
      "ground_elevation_m": 302.0,
      "design_elevation_m": 302.0,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 120.0,
      "ground_elevation_m": 302.4,
      "design_elevation_m": 302.4,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 140.0,
      "ground_elevation_m": 302.8,
      "design_elevation_m": 302.8,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 160.0,
      "ground_elevation_m": 303.2,
      "design_elevation_m": 303.2,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 180.0,
      "ground_elevation_m": 303.6,
      "design_elevation_m": 303.6,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    },
    {
      "station_m": 200.0,
      "ground_elevation_m": 304.0,
      "design_elevation_m": 304.0,
      "difference_m": 0.0,
      "cut_or_fill": "AT_GRADE",
      "grade_percent": 2.0,
      "curve_type": "TANGENT"
    }
  ],
  "summary_text": "Longitudinal Profile: Constant grade tangent profile. GRADE COMPLIANT: Maximum design road grade is 2.00% (limit: 8.0%). Max cut depth = 0.00m, Max fill depth = 0.00m. Total length = 200.00m.",
  "engineer_notice": "LONGITUDINAL PROFILE GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
};

export const SECTIONS = {
  "total_sections": 11,
  "interval_m": 20.0,
  "carriageway_width_m": 7.0,
  "shoulder_width_m": 1.5,
  "camber_slope_percent": -2.5,
  "cut_slope_v_to_h": 0.6667,
  "fill_slope_v_to_h": 0.5,
  "sections": [
    {
      "station_m": 0.0,
      "centreline_x": 100000.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 300.0,
      "design_z": 300.0,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -24.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -23.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -22.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -21.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -20.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -19.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -18.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -17.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -16.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -15.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -14.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -13.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -12.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -11.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -10.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -9.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -8.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -7.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -6.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -5.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -4.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -3.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -2.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": -1.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 0.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 1.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 2.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 3.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 4.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 5.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 6.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 7.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 8.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 9.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 10.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 11.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 12.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 13.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 14.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 15.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 16.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 17.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 18.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 19.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 20.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 21.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 22.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 23.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 24.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 25.0,
          "elevation_m": 300.0
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 300.0
        },
        {
          "offset_m": -5.0,
          "elevation_m": 299.8525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 299.9125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 300.0
        },
        {
          "offset_m": 3.5,
          "elevation_m": 299.9125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 299.8525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 300.0
        }
      ]
    },
    {
      "station_m": 20.0,
      "centreline_x": 100020.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 300.4,
      "design_z": 300.4,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -24.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -23.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -22.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -21.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -20.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -19.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -18.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -17.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -16.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -15.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -14.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -13.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -12.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -11.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -10.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -9.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -8.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -7.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -6.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -5.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -4.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -3.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -2.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": -1.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 0.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 1.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 2.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 3.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 4.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 5.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 6.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 7.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 8.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 9.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 10.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 11.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 12.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 13.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 14.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 15.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 16.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 17.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 18.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 19.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 20.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 21.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 22.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 23.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 24.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 25.0,
          "elevation_m": 300.4
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 300.4
        },
        {
          "offset_m": -5.0,
          "elevation_m": 300.2525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 300.3125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 300.4
        },
        {
          "offset_m": 3.5,
          "elevation_m": 300.3125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 300.2525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 300.4
        }
      ]
    },
    {
      "station_m": 40.0,
      "centreline_x": 100040.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 300.8,
      "design_z": 300.8,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -24.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -23.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -22.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -21.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -20.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -19.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -18.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -17.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -16.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -15.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -14.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -13.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -12.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -11.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -10.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -9.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -8.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -7.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -6.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -5.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -4.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -3.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -2.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": -1.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 0.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 1.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 2.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 3.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 4.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 5.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 6.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 7.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 8.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 9.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 10.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 11.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 12.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 13.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 14.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 15.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 16.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 17.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 18.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 19.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 20.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 21.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 22.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 23.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 24.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 25.0,
          "elevation_m": 300.8
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 300.8
        },
        {
          "offset_m": -5.0,
          "elevation_m": 300.6525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 300.7125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 300.8
        },
        {
          "offset_m": 3.5,
          "elevation_m": 300.7125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 300.6525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 300.8
        }
      ]
    },
    {
      "station_m": 60.0,
      "centreline_x": 100060.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 301.2,
      "design_z": 301.2,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -24.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -23.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -22.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -21.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -20.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -19.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -18.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -17.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -16.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -15.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -14.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -13.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -12.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -11.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -10.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -9.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -8.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -7.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -6.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -5.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -4.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -3.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -2.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": -1.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 0.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 1.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 2.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 3.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 4.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 5.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 6.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 7.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 8.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 9.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 10.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 11.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 12.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 13.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 14.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 15.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 16.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 17.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 18.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 19.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 20.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 21.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 22.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 23.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 24.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 25.0,
          "elevation_m": 301.2
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 301.2
        },
        {
          "offset_m": -5.0,
          "elevation_m": 301.0525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 301.1125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 301.2
        },
        {
          "offset_m": 3.5,
          "elevation_m": 301.1125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 301.0525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 301.2
        }
      ]
    },
    {
      "station_m": 80.0,
      "centreline_x": 100080.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 301.6,
      "design_z": 301.6,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -24.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -23.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -22.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -21.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -20.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -19.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -18.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -17.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -16.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -15.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -14.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -13.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -12.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -11.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -10.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -9.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -8.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -7.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -6.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -5.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -4.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -3.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -2.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": -1.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 0.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 1.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 2.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 3.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 4.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 5.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 6.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 7.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 8.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 9.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 10.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 11.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 12.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 13.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 14.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 15.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 16.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 17.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 18.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 19.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 20.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 21.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 22.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 23.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 24.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 25.0,
          "elevation_m": 301.6
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 301.6
        },
        {
          "offset_m": -5.0,
          "elevation_m": 301.4525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 301.5125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 301.6
        },
        {
          "offset_m": 3.5,
          "elevation_m": 301.5125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 301.4525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 301.6
        }
      ]
    },
    {
      "station_m": 100.0,
      "centreline_x": 100100.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 302.0,
      "design_z": 302.0,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -24.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -23.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -22.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -21.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -20.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -19.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -18.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -17.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -16.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -15.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -14.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -13.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -12.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -11.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -10.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -9.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -8.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -7.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -6.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -5.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -4.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -3.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -2.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": -1.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 0.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 1.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 2.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 3.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 4.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 5.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 6.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 7.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 8.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 9.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 10.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 11.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 12.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 13.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 14.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 15.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 16.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 17.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 18.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 19.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 20.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 21.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 22.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 23.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 24.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 25.0,
          "elevation_m": 302.0
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 302.0
        },
        {
          "offset_m": -5.0,
          "elevation_m": 301.8525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 301.9125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 302.0
        },
        {
          "offset_m": 3.5,
          "elevation_m": 301.9125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 301.8525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 302.0
        }
      ]
    },
    {
      "station_m": 120.0,
      "centreline_x": 100120.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 302.4,
      "design_z": 302.4,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -24.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -23.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -22.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -21.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -20.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -19.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -18.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -17.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -16.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -15.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -14.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -13.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -12.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -11.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -10.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -9.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -8.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -7.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -6.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -5.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -4.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -3.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -2.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": -1.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 0.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 1.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 2.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 3.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 4.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 5.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 6.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 7.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 8.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 9.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 10.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 11.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 12.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 13.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 14.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 15.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 16.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 17.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 18.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 19.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 20.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 21.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 22.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 23.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 24.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 25.0,
          "elevation_m": 302.4
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 302.4
        },
        {
          "offset_m": -5.0,
          "elevation_m": 302.2525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 302.3125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 302.4
        },
        {
          "offset_m": 3.5,
          "elevation_m": 302.3125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 302.2525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 302.4
        }
      ]
    },
    {
      "station_m": 140.0,
      "centreline_x": 100140.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 302.8,
      "design_z": 302.8,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -24.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -23.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -22.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -21.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -20.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -19.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -18.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -17.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -16.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -15.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -14.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -13.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -12.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -11.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -10.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -9.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -8.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -7.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -6.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -5.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -4.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -3.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -2.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": -1.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 0.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 1.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 2.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 3.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 4.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 5.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 6.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 7.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 8.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 9.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 10.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 11.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 12.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 13.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 14.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 15.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 16.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 17.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 18.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 19.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 20.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 21.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 22.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 23.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 24.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 25.0,
          "elevation_m": 302.8
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 302.8
        },
        {
          "offset_m": -5.0,
          "elevation_m": 302.6525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 302.7125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 302.8
        },
        {
          "offset_m": 3.5,
          "elevation_m": 302.7125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 302.6525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 302.8
        }
      ]
    },
    {
      "station_m": 160.0,
      "centreline_x": 100160.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 303.2,
      "design_z": 303.2,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -24.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -23.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -22.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -21.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -20.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -19.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -18.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -17.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -16.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -15.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -14.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -13.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -12.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -11.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -10.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -9.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -8.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -7.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -6.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -5.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -4.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -3.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -2.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": -1.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 0.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 1.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 2.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 3.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 4.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 5.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 6.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 7.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 8.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 9.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 10.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 11.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 12.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 13.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 14.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 15.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 16.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 17.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 18.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 19.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 20.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 21.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 22.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 23.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 24.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 25.0,
          "elevation_m": 303.2
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 303.2
        },
        {
          "offset_m": -5.0,
          "elevation_m": 303.0525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 303.1125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 303.2
        },
        {
          "offset_m": 3.5,
          "elevation_m": 303.1125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 303.0525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 303.2
        }
      ]
    },
    {
      "station_m": 180.0,
      "centreline_x": 100180.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 303.6,
      "design_z": 303.6,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -24.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -23.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -22.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -21.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -20.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -19.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -18.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -17.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -16.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -15.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -14.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -13.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -12.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -11.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -10.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -9.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -8.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -7.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -6.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -5.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -4.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -3.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -2.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": -1.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 0.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 1.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 2.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 3.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 4.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 5.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 6.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 7.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 8.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 9.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 10.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 11.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 12.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 13.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 14.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 15.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 16.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 17.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 18.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 19.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 20.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 21.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 22.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 23.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 24.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 25.0,
          "elevation_m": 303.6
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 303.6
        },
        {
          "offset_m": -5.0,
          "elevation_m": 303.4525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 303.5125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 303.6
        },
        {
          "offset_m": 3.5,
          "elevation_m": 303.5125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 303.4525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 303.6
        }
      ]
    },
    {
      "station_m": 200.0,
      "centreline_x": 100200.0,
      "centreline_y": 200000.0,
      "centreline_bearing_deg": 90.0,
      "ground_z": 304.0,
      "design_z": 304.0,
      "difference_m": 0.0,
      "section_class": "CUT",
      "cut_area_m2": 0.691,
      "fill_area_m2": 0.0,
      "topsoil_strip_width_m": 10.442,
      "left_daylight_offset_m": -5.221,
      "right_daylight_offset_m": 5.221,
      "ground_profile": [
        {
          "offset_m": -25.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -24.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -23.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -22.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -21.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -20.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -19.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -18.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -17.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -16.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -15.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -14.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -13.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -12.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -11.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -10.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -9.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -8.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -7.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -6.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -5.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -4.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -3.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -2.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": -1.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 0.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 1.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 2.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 3.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 4.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 5.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 6.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 7.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 8.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 9.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 10.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 11.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 12.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 13.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 14.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 15.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 16.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 17.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 18.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 19.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 20.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 21.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 22.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 23.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 24.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 25.0,
          "elevation_m": 304.0
        }
      ],
      "design_template": [
        {
          "offset_m": -5.2212,
          "elevation_m": 304.0
        },
        {
          "offset_m": -5.0,
          "elevation_m": 303.8525
        },
        {
          "offset_m": -3.5,
          "elevation_m": 303.9125
        },
        {
          "offset_m": 0.0,
          "elevation_m": 304.0
        },
        {
          "offset_m": 3.5,
          "elevation_m": 303.9125
        },
        {
          "offset_m": 5.0,
          "elevation_m": 303.8525
        },
        {
          "offset_m": 5.2212,
          "elevation_m": 304.0
        }
      ]
    }
  ],
  "total_cut_area_sum_m2": 7.6,
  "total_fill_area_sum_m2": 0.0,
  "summary_text": "Cross-Sections Package: 11 sections generated at 20.0m intervals. Carriageway width = 7.0m, Shoulders = 1.5m. Total cut area sum = 7.60 m\u00b2, Total fill area sum = 0.00 m\u00b2.",
  "engineer_notice": "CROSS-SECTIONS GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
};

export const QUANTITIES = {
  "calculation_method": "Average End Area Method with Prismoidal Analysis",
  "soil_bulking_factor": 1.15,
  "compaction_shrinkage_factor": 0.9,
  "topsoil_strip_depth_m": 0.15,
  "total_cut_volume_m3": 138.2,
  "total_fill_volume_m3": 0.0,
  "factored_fill_volume_m3": 0.0,
  "total_topsoil_strip_volume_m3": 313.26,
  "net_volume_m3": 138.2,
  "balance_status": "EXCESS_CUT",
  "intervals": [
    {
      "interval_id": 1,
      "from_station_m": 0.0,
      "to_station_m": 20.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 13.82,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 13.82
    },
    {
      "interval_id": 2,
      "from_station_m": 20.0,
      "to_station_m": 40.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 27.64,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 27.64
    },
    {
      "interval_id": 3,
      "from_station_m": 40.0,
      "to_station_m": 60.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 41.46,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 41.46
    },
    {
      "interval_id": 4,
      "from_station_m": 60.0,
      "to_station_m": 80.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 55.28,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 55.28
    },
    {
      "interval_id": 5,
      "from_station_m": 80.0,
      "to_station_m": 100.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 69.1,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 69.1
    },
    {
      "interval_id": 6,
      "from_station_m": 100.0,
      "to_station_m": 120.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 82.92,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 82.92
    },
    {
      "interval_id": 7,
      "from_station_m": 120.0,
      "to_station_m": 140.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 96.74,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 96.74
    },
    {
      "interval_id": 8,
      "from_station_m": 140.0,
      "to_station_m": 160.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 110.56,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 110.56
    },
    {
      "interval_id": 9,
      "from_station_m": 160.0,
      "to_station_m": 180.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 124.38,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 124.38
    },
    {
      "interval_id": 10,
      "from_station_m": 180.0,
      "to_station_m": 200.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 0.691,
      "end_cut_area_m2": 0.691,
      "incremental_cut_m3": 13.82,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_m3": 0.0,
      "topsoil_strip_m3": 31.326,
      "cumulative_cut_m3": 138.2,
      "cumulative_fill_m3": 0.0,
      "net_cumulative_m3": 138.2
    }
  ],
  "summary_text": "Earthwork Quantities: Total Cut = 138.20 m\u00b3, Total Fill = 0.00 m\u00b3 (Factored Fill for Compaction = 0.00 m\u00b3). Net Earthwork = +138.20 m\u00b3 (EXCESS CUT). Topsoil Stripping = 313.26 m\u00b3.",
  "engineer_notice": "EARTHWORK QUANTITIES COMPUTED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
};

export const BEME = {
  "project_title": "Lifidi - Piapung Road Corridor (19.50km)",
  "currency": "NGN",
  "engineer_disclaimer": "TO BE CONFIRMED BY A REGISTERED ENGINEER - PRELIMINARY PLACEHOLDER RATES",
  "grand_total": 26293825.0,
  "categories": [
    {
      "categoryCode": "BILL-01",
      "categoryName": "Site Clearance & Preliminary Works",
      "items": [
        {
          "code": "1.01",
          "description": "Site clearance and bush clearing along road corridor",
          "unit": "m\u00b2",
          "quantity": 2000.0,
          "unitRate": 750.0,
          "amount": 1500000.0
        },
        {
          "code": "1.02",
          "description": "Topsoil stripping and stockpiling (depth ~ 150mm)",
          "unit": "m\u00b3",
          "quantity": 313.3,
          "unitRate": 1250.0,
          "amount": 391625.0
        }
      ],
      "subtotal": 1891625.0
    },
    {
      "categoryCode": "BILL-02",
      "categoryName": "Earthworks & Roadbed Formation",
      "items": [
        {
          "code": "2.01",
          "description": "Roadbed excavation in common material (Cut)",
          "unit": "m\u00b3",
          "quantity": 138.2,
          "unitRate": 6000.0,
          "amount": 829200.0
        },
        {
          "code": "2.02",
          "description": "Embankment compaction from approved borrow/cut (Fill)",
          "unit": "m\u00b3",
          "quantity": 0.0,
          "unitRate": 7500.0,
          "amount": 0.0
        }
      ],
      "subtotal": 829200.0
    },
    {
      "categoryCode": "BILL-03",
      "categoryName": "Drainage & Culverts",
      "items": [
        {
          "code": "3.01",
          "description": "Trapezoidal unlined/lined side drainage ditch excavation",
          "unit": "m",
          "quantity": 400.0,
          "unitRate": 14500.0,
          "amount": 5800000.0
        },
        {
          "code": "3.02",
          "description": "900mm reinforced precast concrete pipe culverts",
          "unit": "m",
          "quantity": 24.0,
          "unitRate": 42000.0,
          "amount": 1008000.0
        }
      ],
      "subtotal": 6808000.0
    },
    {
      "categoryCode": "BILL-04",
      "categoryName": "Pavement Courses & Surfacing",
      "items": [
        {
          "code": "4.01",
          "description": "Crushed stone granular subbase course (150mm compacted)",
          "unit": "m\u00b3",
          "quantity": 210.0,
          "unitRate": 18500.0,
          "amount": 3885000.0
        },
        {
          "code": "4.02",
          "description": "Dense bituminous macadam wearing course (50mm compacted)",
          "unit": "m\u00b2",
          "quantity": 1400.0,
          "unitRate": 9200.0,
          "amount": 12880000.0
        }
      ],
      "subtotal": 16765000.0
    }
  ]
};

export const TERRAIN = {
  "surveyPointsUsed": 287,
  "tinTriangles": 545,
  "lowestGroundM": 300.0,
  "highestGroundM": 304.0,
  "meanSlopePercent": 2.0,
  "classification": "Flat",
  "slopeDistribution": [
    {
      "label": "0\u20133%",
      "percentage": 72.0
    },
    {
      "label": "3\u20136%",
      "percentage": 20.0
    },
    {
      "label": "6\u201310%",
      "percentage": 6.0
    },
    {
      "label": ">10%",
      "percentage": 2.0
    }
  ],
  "engineer_disclaimer": "TERRAIN SURFACE MODEL GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
};
