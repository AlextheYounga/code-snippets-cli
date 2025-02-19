```py
def read_zip_file(zip_path):
	# Loads zip file into memory and reads the first file in the archive
	with open(zip_path, "rb") as f:
		zip_bytes = f.read()
		zip_buffer = io.BytesIO(zip_bytes)
		with zipfile.ZipFile(zip_buffer, "r") as zip_file:
			files = zip_file.namelist()
			with zip_file.open(files[0]) as file:
				file_contents = file.read().decode("utf-8")
				return file_contents
```
