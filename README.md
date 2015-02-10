#### What you'll learn in just over 10 minutes

In this **tutorial screencast** we'll look at how to **implement** **JSON Web Tokens** (JWT's) by **building** a simple **single page application** that leverages this simple form of Token based authentication.

We'll use [Koajs](http://koajs.com/) on the server side, [Angularjs](https://angularjs.org/) on the client side and the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package to show you the basics of JWT's in just a few minutes of your time.

#### A changing landscape

Browser **cookies** became a thing over two **decades ago**, and have served us well in that timespan. However **a lot has changed** since their inception, particularly in the last few years with the **rise** of the **Single Page Application** and API's that need to be consumed by multiple clients (Web/native/mobile/etc...).

With these shifts in the developer landscape, I think that it's **time** to seriously **consider** an **alternative** to cookies in certain scenarios, and in this tutorial screencast we'll learn how to use JSON Web Tokens (JWT's) a leading alternative to cookies.

#### What are JSON Web Tokens (JWT's)

JWT's is a token based **authentication scheme** which I believe is **better** approach **than cookie** based authentication in certain scenarios such as with Single Page Applications.

Here are some of the reasons I think JWT's are better:

*   **Cross Domain Communication** - Need to make ajax calls to servers on different domains?  Well good luck with that, when using cookies.  Many developers have burned many hours trying to get this to work... But with JWT's it's almost trivial
*   **Stateless** - You might be able to eliminate your Session store on the server side, by simply putting what you would normally store as session information in the Tokens claim.  This leaves you with a simpler, quicker and more scalable technology stack.
*   **Consistency** - Provides a consistent authentication scheme across different types of clients (Browser/Native/Mobile/etc..)
*   **Cross Site Request Forgery (CSRF)** - one of the more complicated and misunderstood attacks, is a non-issue since you aren’t using cookies.
Now there is one potential **shortcoming** when using JWT, which is **token theft** from Cross Site Scripting (XSS) exploits. Let me explain: **If** you site falls **victim** to a **XSS attack**, **cookies** setup as httponly offer **additional protection** that prevents the session cookies from being sent to the attacker. There is **no** similar **protection** when using **JWT's** in the same compromised scenario, which means the attacker could gain access to the JWT's.

Personally I** don't think** the additional **protection** **offered** by **cookies** is a huge **win** because I'm **not willing** to **accept** the **premise** of the argument. Here is what I mean: if your site has fallen **victim** to **XSS** then you've **already lost**. Granted the attacker **can't** get **access** to your session **cookies**, but the attacker will just move on to **other attacks** such as key logging and phishing. Not to mention **protecting** against **XSS** attacks is fairly well **understood** and most frameworks offer protection from these attacks as a default behavior.

The source for this episode is available at: [https://github.com/knowthen/Episode-9-Ditching-Cookies-for-JSON-Web-Tokens](https://github.com/knowthen/Episode-9-Ditching-Cookies-for-JSON-Web-Tokens)