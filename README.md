StickyNotes-Server
==================

Sticky-Note App using mysql backend
<<<<<<< HEAD

## Install

To install, clone this repo and run the demo using your web-browser.

```bash
#> git clone https://github.com/DaveTechTest/StickyNotes-Server.git
#> cd StickyNotes-Server
```

Create database and edit the following variable in **config.php**
*config.php*:
```php
// Edit the $mysql_user, $mysql_pass, and $mysql_host with your mysql credential
$mysql_user   = "your_username";
$mysql_pass   = "your_password";
$mysql_host   = "localhost";
$mysql_dbname = "sticky_note";
```

Add the following table to the database or import db.sql
```sql
CREATE TABLE IF NOT EXISTS `notes` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `noteid` mediumint(8) unsigned NOT NULL,
  `username` varchar(255) NOT NULL,
  `color` varchar(10) NOT NULL,
  `leftpos` varchar(10) NOT NULL,
  `toppos` varchar(10) NOT NULL,
  `zIndex` smallint(5) unsigned NOT NULL,
  `textnote` text NOT NULL,
  `timenote` bigint(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `noteid` (`noteid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1001 ;

```

Run the app by visiting http://www.app-url.com/ in your web-browser.

## Screenshot

![alt text](http://stickynotes.6te.net/screenshot-server.png "StickyNote-Local Screenshot")
=======
>>>>>>> 6812c4b81f7c47564f7a579d40fe6937d5edcce1
