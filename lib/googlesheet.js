function doPost(e) {
    var myData = JSON.parse(e.postData.contents);

        // sample return of myData:
        // {
        //     "operation": "publish",
        //     "data": {
        //       "__typename": "Order",
        //       "abcVariations": [],
        //       "buyer": "7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n",
        //       "collections": [],
        //       "colorOption": "",
        //       "createdAt": "2023-01-26T21:07:03.714135+00:00",
        //       "createdBy": {
        //         "__typename": "User",
        //         "id": "ckg835oapr4fi01we98jl780t"
        //       },
        //       "discord": "",
        //       "email": "",
        //       "fulfilled": null,
        //       "id": "clddl5wactvde0ak8gfkzgo6z",
        //       "note": "",
        //       "orderID": "sQJXRcW6eMimxRgcbRAfYx17uGgh2UqnTscYPmLbXc7",
        //       "price": ".01",
        //       "productid": [
        //         {
        //           "__typename": "Product",
        //           "id": "clddj6doyqtrk0bioj6rucrgd"
        //         }
        //       ],
        //       "publishedAt": "2023-01-26T21:07:04.04926+00:00",
        //       "publishedBy": {
        //         "__typename": "User",
        //         "id": "ckg835oapr4fi01we98jl780t"
        //       },
        //       "purchaseDate": "2023-01-26T21:06:50+00:00",
        //       "scheduledIn": [],
        //       "shipping": "",
        //       "slug": null,
        //       "stage": "PUBLISHED",
        //       "token": "usdc",
        //       "trackingNumber": null,
        //       "twitter": "",
        //       "updatedAt": "2023-01-26T21:07:03.714135+00:00",
        //       "updatedBy": {
        //         "__typename": "User",
        //         "id": "ckg835oapr4fi01we98jl780t"
        //       }
        //     }
        //   }
        // extract the data from the object
        var data = myData.data;

        
        
        var dbId = data.id;
        // extract the orderId from the data object
        var orderId = data.orderID;
        var buyer = data.buyer;
        var collections = data.collections;
        var productIdArray = data.productid // array of objects
        //map the productids array to an array of just the ids
        var productids = productIdArray.map(function(productid) {
            return productid.id;
        });
        var price = data.price;
        var token = data.token;
        var email = data.email;
        var discord = data.discord;
        var twitter = data.twitter;
        var note = data.note;
        // extract the shipping info from the data object
        var shipping = JSON.parse(data.shipping);
       




        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
        var lastRow = Math.max(sheet.getLastRow(),1);
        sheet.insertRowAfter(lastRow);
        var timestamp = new Date();

        sheet.getRange(lastRow + 1, 1).setValue(timestamp);
        sheet.getRange(lastRow + 1, 2).setValue(dbId);
        sheet.getRange(lastRow + 1, 3).setValue(orderId);
        sheet.getRange(lastRow + 1, 4).setValue(buyer);
        sheet.getRange(lastRow + 1, 5).setValue(collections);
        sheet.getRange(lastRow + 1, 6).setValue(productids);
        sheet.getRange(lastRow + 1, 7).setValue(price);
        sheet.getRange(lastRow + 1, 8).setValue(token);
        sheet.getRange(lastRow + 1, 9).setValue(email);
        sheet.getRange(lastRow + 1, 10).setValue(discord);
        sheet.getRange(lastRow + 1, 11).setValue(twitter);
        sheet.getRange(lastRow + 1, 12).setValue(note);
        sheet.getRange(lastRow + 1, 13).setValue(shipping);
        


        SpreadsheetApp.flush(); //

        //send email
        var emailAddress = "maweiche@gmail.com";
        var emailAddress2 = "kulmike@gmail.com";
        var subject = "Dude! New Order!";
        //list the values in the email as a UL
        var body = "Yo Dude! New Order! <br><br> <ul><li>dbId: " + dbId + "</li><li>orderId: " + orderId + "</li><li>buyer: " + buyer + "</li><li>collections: " + collections + "</li><li>productids: " + productids + "</li><li>price: " + price + "</li><li>token: " + token + "</li><li>email: " + email + "</li><li>discord: " + discord + "</li><li>twitter: " + twitter + "</li><li>note: " + note + "</li><li>shipping: " + shipping + "</li></ul>";


        MailApp.sendEmail(emailAddress, subject, body);
        MailApp.sendEmail(emailAddress2, subject, body);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);
        
    }