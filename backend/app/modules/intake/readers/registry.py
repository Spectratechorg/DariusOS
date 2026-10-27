from typing import List
from app.modules.intake.readers.base import BaseReader
from app.modules.intake.readers.csv_reader import CsvReader
from app.modules.intake.readers.xyz_reader import XyzReader
from app.modules.intake.readers.las_reader import LasReader

# Registry of swappable readers
_READERS: List[BaseReader] = [
    LasReader(),
    CsvReader(),
    XyzReader()
]


def register_reader(reader: BaseReader) -> None:
    """Allows runtime extension with custom point cloud format readers."""
    _READERS.insert(0, reader)


def get_reader_for_file(filename: str, sample_bytes: bytes) -> BaseReader:
    """
    Selects the appropriate reader based on filename and header inspection.
    """
    for reader in _READERS:
        if reader.can_read(filename, sample_bytes):
            return reader

    supported = [r.format_name for r in _READERS]
    raise ValueError(
        f"Unsupported file format for '{filename}'. Supported survey formats: {', '.join(supported)}."
    )
