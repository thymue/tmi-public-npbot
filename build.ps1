# Remove all files from ./build/
Get-ChildItem -File -Recurse -Path "./build/" | `
ForEach-Object {
	Remove-Item -Path $_.FullName;
}

# Compile typescript
tsc

# Package the app
pkg --out-path ./build ./build/src/index.js
