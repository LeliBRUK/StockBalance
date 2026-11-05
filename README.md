# Stock Balance

**This is a test page.** It is a working design frame for a stock and ordering tool, built to show how the finished version could look and behave. It is not the real system yet, and nothing here orders anything.

The idea: track stock for the cleaning products, delivery boxes, packing materials and labels used at work, see what is running low, and put together an order grouped by shop. When the real version is built, this design and layout can be carried over and connected to real data and real suppliers.

## What each page does

| Page | Purpose |
| --- | --- |
| **Home** (`index.html`, the main address) | Shows every item with a level bar and "Well stocked", "Running low" or "Out of stock". Use − and + (or type a number) to change stock. Items can be added to an order cart, which groups them by shop. |
| **Daily usage** (`daily-usage.html`) | Set how much of each item is used per day. Stock drops by that amount every day automatically. |
| **Shops** (`shops.html`) | Lists the shops you buy from and links each item to one or more shops with a price. Shops and prices can be edited, added and removed. |
| **Sign in** (`login.html`) | Password screen shown before the other pages. |

## How it works

- **Daily drop:** each time a page opens, stock is reduced by the daily usage for every day that has passed since the last visit. The site does not need to be open for days to count.
- **Cart:** uses the cheapest linked shop for each item by default, and you can pick a different shop per item. The "Place orders" button only shows a message. It is a demo.
- **Items with no shop** show "Link a shop" and cannot go in the cart until one is linked on the Shops page.

## Important limits of this test version

- **Data is saved in each browser only.** Stock counts, usage rates, shops and prices live in the browser's local storage. A different computer, phone or browser starts from the starting list, and clearing browser data wipes it. A real version would need a database so everyone shares the same numbers.
- **The sign-in is a basic gate, not real security.** This is a static site on GitHub Pages, so the password check runs in the browser and the page files are public. It keeps casual visitors out. It does not protect anything sensitive, so do not put supplier logins, account numbers or private information in the site. A real version should use proper server-side login.
- **Prices are starting estimates.** They were taken from UK supplier websites in November 2026. Some are ex VAT and some inc VAT, and items marked "Estimate" had no reliable price. The starting shops are just where those prices were found. Replace them with your real suppliers and prices.
- **Stock numbers and daily usage are placeholders** and need setting to match real usage.
- **No real ordering.** Automating purchases would need each supplier's ordering system or an API, and many shops do not offer one.

## Changing the site

The site is four plain files: `index.html`, `daily-usage.html`, `shops.html` and `login.html`. On GitHub Pages they open at clean addresses: the main address for Home, then `/daily-usage`, `/shops` and `/login`. These clean links only work on the live site. If you open the files straight from a folder on your computer, the menu links will not find each other. Each one has its styling and code built in, so they work as long as they sit in the same folder. To update the live site, change the files and commit. GitHub Pages republishes within a minute or two.

## Hosting on Firebase (optional)

`firebase.json` is included so the same files can be hosted on Firebase Hosting instead of GitHub Pages. With the Firebase CLI installed and a Firebase project created, deploy with `firebase deploy --only hosting --project YOUR_PROJECT_ID`. Firebase Hosting is still static hosting. A shared database and a real login need Firestore and Firebase Authentication, which are a later step. GitHub Pages ignores this file, so both can run side by side.
