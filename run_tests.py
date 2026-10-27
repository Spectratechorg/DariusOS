import sys
import pytest

if __name__ == "__main__":
    args = sys.argv[1:] if len(sys.argv) > 1 else ["backend/tests/test_scaffold.py", "-v"]
    exit_code = pytest.main(args)
    sys.exit(exit_code)
