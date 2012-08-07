Array.prototype.unique = function () {
    var r = new Array();
    o:for(var i = 0, n = this.length; i < n; i++)
    {
        for(var x = 0, y = r.length; x < y; x++)
        {
            if(r[x]==this[i])
            {
                continue o;
            }
        }
        r[r.length] = this[i];
    }
    return r;
};

function extractDays() {

    var day_values = [];

    // column indexes starting with zero
    var column_index_duration = 3;

    // monday, tuesday, thursday, wednesday, friday, saturday, sunday
    days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

    $(days).each(function(day_index, day){
        // get the duration
        var day_class = ".tag_" + (day_index + 1);
        var day_rows = $('tr' + day_class);

        // ensure that the day exists in the listing (saturday and friday might not exist)
        if (day_rows.length > 0) {
            // first td is the date on the left site
            var day_month = $(day_rows).find('div.tag_monat')[0].innerHTML;
            console.log("*** " + day + " " + day_month);

            var day_sum = 0;
            var day_items = [];

            day_rows.each(function(process_index,day_row) {
                // the first cell in the first column of a day represents the left day column
                // therefore we filter the cells by class 'pz'
                var process_columns = $(day_row).find('td.pz');
                var description = $(process_columns).find('div.textkurz>span')[0];
                var description_text = description ? description.innerHTML : "";
                var duration_cell = process_columns[column_index_duration];
                // check whether a duration is given
                if (duration_cell) {
                    var duration_text = duration_cell.innerHTML;
                    if (duration_text) {
                        var duration = parseFloat(duration_text.replace(",", "."));
                        // check whether the duration is billable
                        var is_billable = $(day_row).find('img[alt="fakturierbar"]').length == 1;

                        if (is_billable) {
                            day_sum += duration;
                            day_items.push(description_text);
                            console.log(description_text + " " + duration_text);
                        }
                    }
                }
            });
            day_values.push({date: day_month, hours: day_sum, items: day_items});
        }
    });
    return day_values;
}

function generateHtmlTable(daysArray) {
  for (var i = 0; i < daysArray.length; ++i) {
    daysArray[i].items = daysArray[i].items.unique();
  }
  daysArray = daysArray.reverse();

  html = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
    '<title>ZepExtract</title></head><body><div style="position:absolute;top: 0px; left: 0px; margin: 20px auto; width: 50%; padding: 10px; background-color: 10px">' + 
    '<table style="border: 1px solid gray">';

  for (var i = 0; i < daysArray.length; ++i) {
    html += "<tr><td>" + daysArray[i].date + "</td><td>";
    for (var j = 0; j < daysArray[i].items.length; ++j) {
     html += daysArray[i].items[j] + "<br>";
    }
    html += "</td><td>" + ("" + daysArray[i].hours).replace(".", ",");
    html += "</td></tr>";
  }

  return html + "</table>" + 
  "</div></body></html>";
}

function openPage() {
  window.open("about:blank").document.write(generateHtmlTable(extractDays()));
  return false;
}

if ($("#container .submenu ul li.current a").text() == "Projektzeiten") {
  $("#user_menu").append(" | <a href='javascript: openPage();'>Freelancing</a>");
}