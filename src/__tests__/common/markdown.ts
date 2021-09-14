import { stripIndents } from "common-tags";

const markdownFile = stripIndents`
    # Heading

	Excepteur culpa sit ex do ea qui Lorem.

	## Sub Heading

	![01](https://i.imgur.com/TFhdvgt.png)

	![01](https://i.imgur.com/1y23q6I.png)

	![02](https://i.imgur.com/Nqk5I6p.png)

	![alt with spaces](https://i.imgur.com/Nqk5I6p.png)

	Thanks.`;

export default markdownFile;
