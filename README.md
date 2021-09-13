# Markdown 2 Asset

Convert urls from websites like imgur to files on your local computer.

## Getting Started

Given a markdown file...

```markdown
# My Markdown File

![01](https://i.imgur.com/TFhdvgt.png)

![01](https://i.imgur.com/1y23q6I.png)

![02](https://i.imgur.com/Nqk5I6p.png)
```

Running this command...

```none
md2asset folder/file.md
```

Will generate...

```none
folder
├── assets
│   ├── 01_1.png
│   ├── 01_2.png
│   └── 02_1.png
└── test.md
```

## Additional Notes

Take a look at the `downloadImage` event emitter to add your own custom hooks.

## Dev notes

After making a change, test the app using `npm link` to simulate it as a real CLI app.

```none
npm unlink md2asset && \
npm run build && \
npm link && md2asset test/test.md
```

If you wish to run the app on a real file, you can use the `NO_WRITE` environment variable.

```none
NO_WRITE=true npm run dev
```
