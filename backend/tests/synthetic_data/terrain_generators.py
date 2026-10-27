import io
from pathlib import Path
from typing import Optional, Tuple
import numpy as np

from app.modules.intake.readers.base import POINT_DTYPE


def generate_flat_plane_points(
    length_x: float = 100.0,
    width_y: float = 40.0,
    spacing: float = 5.0,
    z_elevation: float = 100.0
) -> np.ndarray:
    """
    Generates synthetic survey points for a perfectly flat horizontal plane.
    X from 0 to length_x, Y from -width_y/2 to +width_y/2.
    """
    xs = np.arange(0.0, length_x + 1e-4, spacing)
    ys = np.arange(-width_y / 2.0, width_y / 2.0 + 1e-4, spacing)
    xx, yy = np.meshgrid(xs, ys)
    x_flat = xx.flatten()
    y_flat = yy.flatten()
    z_flat = np.full_like(x_flat, z_elevation)

    points = np.empty(len(x_flat), dtype=POINT_DTYPE)
    points["x"] = x_flat
    points["y"] = y_flat
    points["z"] = z_flat
    points["classification"] = 2  # Ground class
    return points


def generate_sloped_plane_points(
    length_x: float = 100.0,
    width_y: float = 40.0,
    spacing: float = 5.0,
    grade: float = 0.02,
    z_base: float = 50.0
) -> np.ndarray:
    """
    Generates synthetic survey points for a uniformly sloping terrain (e.g. +2% grade along X).
    Z(x, y) = z_base + grade * x.
    """
    xs = np.arange(0.0, length_x + 1e-4, spacing)
    ys = np.arange(-width_y / 2.0, width_y / 2.0 + 1e-4, spacing)
    xx, yy = np.meshgrid(xs, ys)
    x_flat = xx.flatten()
    y_flat = yy.flatten()
    z_flat = z_base + grade * x_flat

    points = np.empty(len(x_flat), dtype=POINT_DTYPE)
    points["x"] = x_flat
    points["y"] = y_flat
    points["z"] = z_flat
    points["classification"] = 2
    return points


def generate_hill_points(
    length_x: float = 100.0,
    width_y: float = 40.0,
    spacing: float = 5.0,
    peak_height: float = 4.0,
    z_base: float = 100.0
) -> np.ndarray:
    """
    Generates synthetic survey points for a smooth parabolic ridge/hill along X:
    Z(x, y) = z_base + peak_height * [4 * x * (length_x - x) / (length_x^2)].
    Peak is at x = length_x / 2.
    """
    xs = np.arange(0.0, length_x + 1e-4, spacing)
    ys = np.arange(-width_y / 2.0, width_y / 2.0 + 1e-4, spacing)
    xx, yy = np.meshgrid(xs, ys)
    x_flat = xx.flatten()
    y_flat = yy.flatten()

    norm_x = x_flat / length_x
    z_profile = z_base + peak_height * 4.0 * norm_x * (1.0 - norm_x)

    points = np.empty(len(x_flat), dtype=POINT_DTYPE)
    points["x"] = x_flat
    points["y"] = y_flat
    points["z"] = z_profile
    points["classification"] = 2
    return points


def points_to_csv_bytes(
    points: np.ndarray,
    header: bool = True,
    delimiter: str = ","
) -> bytes:
    """Serializes points array into UTF-8 CSV bytes."""
    buf = io.StringIO()
    if header:
        buf.write(f"Easting{delimiter}Northing{delimiter}Elevation{delimiter}Classification\n")
    for pt in points:
        buf.write(f"{pt['x']:.3f}{delimiter}{pt['y']:.3f}{delimiter}{pt['z']:.3f}{delimiter}{pt['classification']}\n")
    return buf.getvalue().encode("utf-8")


def points_to_xyz_bytes(points: np.ndarray) -> bytes:
    """Serializes points array into space-delimited XYZ bytes."""
    buf = io.StringIO()
    for pt in points:
        buf.write(f"{pt['x']:.3f} {pt['y']:.3f} {pt['z']:.3f}\n")
    return buf.getvalue().encode("utf-8")


def points_to_las_bytes(points: np.ndarray, temp_path: Path) -> bytes:
    """Creates a valid ASPRS LAS 1.2 file and returns raw bytes."""
    import laspy

    header = laspy.LasHeader(point_format=3, version="1.2")
    header.offsets = [0.0, 0.0, 0.0]
    header.scales = [0.001, 0.001, 0.001]

    las = laspy.LasData(header)
    las.x = points["x"]
    las.y = points["y"]
    las.z = points["z"]
    las.classification = points["classification"]

    las.write(temp_path)
    return temp_path.read_bytes()
