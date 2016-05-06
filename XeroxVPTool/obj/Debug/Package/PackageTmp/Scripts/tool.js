/**********************************Plugin Code***************************************/
jQuery.fromXMLString = function (strXML) {
    if (window.DOMParser) {
        return jQuery(new DOMParser().parseFromString(strXML, "text/xml"));
    } else if (window.ActiveXObject) {
        var doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        doc.loadXML(strXML);
        return jQuery(doc);
    } else {
        return jQuery(strXML);
    }
};
/**********************************Plugin Code ends*********************************/
/***********************************************************************************/

//Global Variables
var Manufacturer;
var Model = new Array();
var OEMPartNo = new Array();
var OEMCost;
var XRCCost;
var contact;
var elink;
var csymbol;
var calign;

jQuery(document).ready(function () {

    //if internet explore, change the width
    if ($.browser.msie) {
        $("#exptotsave").attr('width', "22%");
    }

    if ($.browser.safari) {
        $("#exptotsave").attr('width', "18%");
    }

    // Get data, 
    xml = xmlString;

    //$.get("Reseller.xml", function (xml) {

    contact = $(xml).find("UserDetails").attr('ContactNumber');
    csymbol = $(xml).find("UserDetails").attr('Currency');
    calign = $(xml).find("UserDetails").attr('CurrencySymbol');


    $("#contactus").text("Tel:" + contact);
    var ary = [];

    $(xml).find("Manufacturer").each(function () {
        ary.push($(this).attr('value'));
    });

    window.removeDuplicateElement(ary);
    ary.sort();
    $.each(ary, function (val, text) {
        val = val + 1;
        $('#manufacturer').append($('<option></option>').val(val).html(text));
    });

    elink = document.getElementById('emailpage');
    //});
});


function emailclick() {
    elink.href = "mailto:?subject=Your Xerox savings calculation&body=";

    var str = document.getElementById('tbselectedrows');
    var bodystr = '';
    var rowlength = str.rows.length;

    for (i = 0; i < rowlength; i++) {

        var oCells = str.rows.item(i).cells;
        //gets cells of current row
        var cellLength = oCells.length;
        for (var j = 0; j < cellLength; j++) {

            //              <!--get your cell info here-->
            var cellVal;
            if (j == 3 && i > 0)
                cellVal = oCells.item(j).childNodes[1].value;
            else
                cellVal = oCells.item(j).textContent;
            cellVal = cellVal.replace(/(^\s+|\s+$)/g, '');
            if (cellVal != '')
                if (j != (cellLength - 2))
                    bodystr = bodystr + cellVal + ' \t ';
                else
                    bodystr = bodystr + cellVal;
        }

        bodystr = bodystr + '\n';
    }

    var expsav = document.getElementById('lbltotalsavings').value;
    if (expsav != '')
        bodystr = bodystr + 'Expected total monthly savings = ' + expsav;
    else
        bodystr = bodystr + 'Expected total monthly savings = 0';
    bodystr = bodystr.replace(/(^\s+|\s+$)/g, '');
    elink.href += encodeURI(bodystr);
}

function LoadModelDropDown() {

    for (i = 1; i < Model.length; i++) {
        $("#model").find("option").attr('value', i).remove();
    }

    // check whether the initial value of dropdown exists
    var exists = false;
    $("#model > option").each(function () {
        if ($(this).text() == 'Printer Model') {
            exists = true;
        }
    });

    //if not exists append the initial value
    if (!exists) {
        $("#model").append($("<option />").val(0).text('Printer Model'));
        $('#model option[value="0"]').attr("selected", true);
    }

    var selectedmanufacture = $('#manufacturer option:selected').text();

    // Get data, parse it into an array.
    //$.get("Reseller.xml", function (xml) {

        $(xml).find("Manufacturer").each(function () {

            var manufacture = $(this).attr('value');

            if (selectedmanufacture == manufacture) {

                var ary = [];
                $(this).find('Model').each(function () {

                    //loading model dropdown
                    ary.push($(this).attr('value'));

                    Model.push($(this).attr('value'));
                });
                removeDuplicateElement(ary);
                ary.sort();
                $.each(ary, function (val, text) {
                    val = val + 1;
                    $('#model').append($('<option></option>').val(val).html(text));
                });
            }
        });
    //});

    LoadOEMPartDropDown();
}

function removeDuplicateElement(arrayName) {
    var newArray = new Array();
    label: for (var i = 0; i < arrayName.length; i++) {
        for (var j = 0; j < newArray.length; j++) {
            if (newArray[j] == arrayName[i])
                continue label;
        }
        newArray[newArray.length] = arrayName[i];
    }
    return newArray;
}


function LoadOEMPartDropDown() {

    $("#tonercode").find("option").attr('value', 0).remove();
    $("#tonercode").append($("<option />").val(0).text('OEM Toner Code'));
    $('#tonercode option[value="0"]').attr("selected", true);

    var selectedmanufacture = $('#manufacturer option:selected').text();
    var selectedmodel = $('#model option:selected').text();

    // Get data, parse it into an array.
    //$.get("Reseller.xml", function (xml) {

        $(xml).find("Manufacturer").each(function () {

            var manufacture = $(this).attr('value');

            if (selectedmanufacture == manufacture) {
                var ary = [];
                $(this).find('Model').each(function () {

                    var model = $(this).attr('value');

                    if (selectedmodel == model) {

                        $(this).find('PartNumber').each(function () {
                            ary.push($(this).attr('OEMPartNumber'));
                            OEMPartNo.push($(this).attr('OEMPartNumber'));

                        });
                    }
                });

                removeDuplicateElement(ary);
                ary.sort();
                $("#tonercode").append($("<option />").val(1).text('Select all'));
                $.each(ary, function (val, text) {
                    val = val + 2;
                    $('#tonercode').append($('<option></option>').val(val).html(text));
                });
                // if only one toner code present, take out select all & toner code option from dropdown.
                if ($("#tonercode option").length == 3) {
                    $("#tonercode option[value=0]").remove();
                    $("#tonercode option[value=1]").remove();
                }
            }
        });
    //});
}

function sortDropDownListByText(selectId) {
    $(selectId).html($(selectId + " option").sort(function (a, b) {
        if (a.text == "Select all" || a.text == "Printer Brand" || a.text == "OEM Toner Code" || a.text == "Printer Model") {
            return -1;
        }
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
    }));

};

var count = 0;
var defaultcartridgepermonth = 1;
var selectedmanufacturer = '';
var selectedmodel = '';
var selectedpartnumber = '';

function AddUserSelection() {

    // check whether the initial value of dropdown exists
    var exists = false;
    $('.errortext').text('');
    $("#manufacturer > option").each(function () {
        if ($(this).text() == 'Printer Brand') {
            exists = true;
        }
    });

    //if not exists append the initial value
    if (!exists) {
        $("#manufacturer").append($("<option />").val(0).text('Printer Brand'));
        $('#manufacturer option[value="0"]').attr("selected", true);
    }

    //get the user selection values from the dropdown
    selectedmanufacturer = $('#manufacturer option:selected').text();
    selectedmodel = $('#model option:selected').text();
    selectedpartnumber = $('#tonercode option:selected').text();

    //check if the combination of user selection already exists

    if (count != 0) {
        var existingmanufacturer = $('table#tbselectedrows').find("tr[manufacturer='" + selectedmanufacturer + "'][model='" + selectedmodel + "'][partnumber='" + selectedpartnumber + "']").attr('manufacturer');
        var existingmodel = $('table#tbselectedrows').find("tr[manufacturer='" + selectedmanufacturer + "'][model='" + selectedmodel + "'][partnumber='" + selectedpartnumber + "']").attr('model');
        var existingpartnumber = $('table#tbselectedrows').find("tr[manufacturer='" + selectedmanufacturer + "'][model='" + selectedmodel + "'][partnumber='" + selectedpartnumber + "']").attr('partnumber');

        if (selectedmanufacturer == existingmanufacturer && selectedmodel == existingmodel && selectedpartnumber == existingpartnumber) {
            $('.errortext').text('Your selected Printer Brand, Model & OEM Toner Code already exists below.');
            return false;
        }
    }

    if (selectedmanufacturer != 'Printer Brand' && selectedmodel != 'Printer Model' && selectedpartnumber != 'OEM Toner Code') {

        //if the OEMPartNumber
        if (selectedpartnumber != 'Select all') {

            CalculateMonthlySavings(selectedmanufacturer, selectedmodel, selectedpartnumber, defaultcartridgepermonth);

        }
        else {
            $("#tonercode > option").each(function () {
                if ($(this).text() != 'OEM Toner Code' && $(this).text() != 'Select all') {
                    selectedpartnumber = $(this).text();

                    existingmanufacturer = $('table#tbselectedrows').find("tr[manufacturer='" + selectedmanufacturer + "'][model='" + selectedmodel + "'][partnumber='" + selectedpartnumber + "']").attr('manufacturer');
                    existingmodel = $('table#tbselectedrows').find("tr[manufacturer='" + selectedmanufacturer + "'][model='" + selectedmodel + "'][partnumber='" + selectedpartnumber + "']").attr('model');
                    existingpartnumber = $('table#tbselectedrows').find("tr[manufacturer='" + selectedmanufacturer + "'][model='" + selectedmodel + "'][partnumber='" + selectedpartnumber + "']").attr('partnumber');

                    if (selectedmanufacturer == existingmanufacturer && selectedmodel == existingmodel && selectedpartnumber == existingpartnumber) {
                        $('.errortext').text('Your selected Printer Brand, Model & OEM Toner Code already exists below.');
                        return false;
                    }
                    else
                        CalculateMonthlySavings(selectedmanufacturer, selectedmodel, selectedpartnumber, defaultcartridgepermonth);
                }
            });
        }


    } else if (selectedmanufacturer == 'Printer Brand' && selectedmodel == 'Printer Model' && selectedpartnumber == 'OEM Toner Code') {
        $('.errortext').text('Please select Printer Brand, Printer Model & OEM Toner Code.');

    } else if (selectedmanufacturer == 'Printer Brand' && selectedmodel != 'Printer Model' && selectedpartnumber == 'OEM Toner Code') {
        $('.errortext').text('Please select Printer Brand & OEM Toner Code.');

    } else if (selectedmanufacturer == 'Printer Brand' && selectedmodel == 'Printer Model' && selectedpartnumber != 'OEM Toner Code') {
        $('.errortext').text('Please select Printer Brand & Printer Model.');

    } else if (selectedmanufacturer != 'Printer Brand' && selectedmodel == 'Printer Model' && selectedpartnumber == 'OEM Toner Code') {
        $('.errortext').text('Please select Printer Model & OEM Toner Code.');

    } else if (selectedmanufacturer == 'Printer Brand' && selectedmodel != 'Printer Model' && selectedpartnumber != 'OEM Toner Code') {
        $('.errortext').text('Please select Printer Brand.');

    } else if (selectedmanufacturer != 'Printer Brand' && selectedmodel == 'Printer Model' && selectedpartnumber != 'OEM Toner Code') {
        $('.errortext').text('Please select Printer Model.');

    } else if (selectedmanufacturer != 'Printer Brand' && selectedmodel != 'Printer Model' && selectedpartnumber == 'OEM Toner Code') {
        $('.errortext').text('Please select OEM Toner Code.');
    }

    count++;

    $("#model").find("option").attr('value', 0).remove();
    $("#model").append($("<option />").val(0).text('Printer Model'));
    $('#model option[value="0"]').attr("selected", true);

    $("#tonercode").find("option").attr('value', 0).remove();
    $("#tonercode").append($("<option />").val(0).text('OEM Toner Code'));
    $('#tonercode option[value="0"]').attr("selected", true);


    $('#manufacturer option[value="0"]').attr("selected", true);
    $('#model option[value="0"]').attr("selected", true);
    $('#tonercode option[value="0"]').attr("selected", true);

    return false;
}


//Function returns the expected monthly savings for each selected manufacturer, model & part number

function CalculateMonthlySavings(selectedmanufacturer, selectedmodel, selectedpartnumber, paramUserinput) {

    var trappendrow = jQuery("#trappendedrow").clone();

    //append all the column values
    jQuery(trappendrow).attr("manufacturer", selectedmanufacturer);
    jQuery(trappendrow).attr("model", selectedmodel);
    jQuery(trappendrow).attr("partnumber", selectedpartnumber);

    jQuery(trappendrow).find("td[class=\"tdmanufacturer\"] label").text(selectedmanufacturer);
    jQuery(trappendrow).find("td[class=\"tdmodel\"] label").text(selectedmodel);
    jQuery(trappendrow).find("td[class=\"tdpartnumber\"] label").text(selectedpartnumber);

    jQuery(trappendrow).find("td[class=\"tdcartridge\"] img[id=\"tdcartridgeminus\"]").click(function () { return ShowDecrementCalculation(selectedmanufacturer, selectedmodel, selectedpartnumber) });

    jQuery(trappendrow).find("td[class=\"tdcartridge\"]").find("input[id=\"cartridgesselection\"]").val(defaultcartridgepermonth);
    jQuery(trappendrow).find("td[class=\"tdcartridge\"] img[id=\"tdcartridgeplus\"]").click(function () { return ShowIncrementCalculation(selectedmanufacturer, selectedmodel, selectedpartnumber) });


    //get OEC & XRC Cost value from XML for the corresponding selection
    //$.get("Reseller.xml", function (xml) {

        $(xml).find("Manufacturer").each(function () {

            var manufacture = $(this).attr('value');

            if (selectedmanufacturer == manufacture) {

                $(this).find('Model').each(function () {

                    var model = $(this).attr('value');

                    if (selectedmodel == model) {

                        $(this).find('PartNumber').each(function () {

                            var partnumber = $(this).attr('OEMPartNumber');

                            if (selectedpartnumber == partnumber) {

                                var OEM_Cost = $(this).attr('OEMCost');
                                var XRC_Cost = $(this).attr('XRCCost');
                                var OEM_Cartridge = $(this).attr('OEMCartridge');
                                var XRC_Cartridge = $(this).attr('XRCCartridge');

                                //calculate the total savings
                                var calculatedmonthlysavings = (paramUserinput * OEM_Cartridge / XRC_Cartridge) * XRC_Cost - (paramUserinput * OEM_Cost);

                                var roundcalculatedmonthlysavings = roundNumber(calculatedmonthlysavings, 2);
                                var removenegvalue = roundNumber(Math.abs(roundcalculatedmonthlysavings), 2);

                                if (csymbol == '€')
                                    removenegvalue = removenegvalue.replace('.', ',');

                                if (calign.toLowerCase() == 'yes')
                                    jQuery(trappendrow).find("td[class=\"tdmonthlysaving\"] label").text(removenegvalue + ' ' + csymbol);
                                else
                                    jQuery(trappendrow).find("td[class=\"tdmonthlysaving\"] label").text(csymbol + ' ' + removenegvalue);

                                jQuery(trappendrow).find("td[class=\"tddelete\"] img").click(function () { return DeleteRow(selectedmanufacturer, selectedmodel, selectedpartnumber, calculatedmonthlysavings) });

                                jQuery(trappendrow).show();
                                jQuery("#tbselectedrows").append(trappendrow);

                                //show total monthly savings
                                var total = TotalSavingsCalc(calculatedmonthlysavings, 'add', 0);
                                if (csymbol == '€')
                                    total = total.replace('.', ',');

                                if (calign.toLowerCase() == 'yes')
                                    $('#lbltotalsavings').val(total + ' ' + csymbol);
                                else
                                    $('#lbltotalsavings').val(csymbol + ' ' + total);

                                $('.totalsavings').show();
                            }
                        });
                    }
                });
            }
        });
    //});
}

//Function that returns calculated value to 2 decimals

function roundNumber(num, dec) {
    //var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    var result = num.toFixed(dec);
    return result;
}

var decrementedvalue = 0;

function ShowDecrementCalculation(param_manufacturer, param_model, param_partnumber) {

    // get the current value
    decrementedvalue = $('table#tbselectedrows').find("tr[manufacturer='" + param_manufacturer + "'][model='" + param_model + "'][partnumber='" + param_partnumber + "']").find("td[class=\"tdcartridge\"] input").val();
    decrementedvalue--;
    var currentvalue = decrementedvalue;
    $('table#tbselectedrows').find("tr[manufacturer='" + param_manufacturer + "'][model='" + param_model + "'][partnumber='" + param_partnumber + "']").find("td[class=\"tdcartridge\"] input").val('');
    $('table#tbselectedrows').find("tr[manufacturer='" + param_manufacturer + "'][model='" + param_model + "'][partnumber='" + param_partnumber + "']").find("td[class=\"tdcartridge\"] input").val(decrementedvalue);

    ChangeMonthlySavingsCalculation(param_manufacturer, param_model, param_partnumber, decrementedvalue, currentvalue, 'decrement');

    return false;
}

var incrementedvalue = 0;

function ShowIncrementCalculation(param_manufacturer, param_model, param_partnumber) {

    // get the current value
    incrementedvalue = $('table#tbselectedrows').find("tr[manufacturer='" + param_manufacturer + "'][model='" + param_model + "'][partnumber='" + param_partnumber + "']").find("td[class=\"tdcartridge\"] input").val();
    incrementedvalue++;
    var currentvalue = incrementedvalue;
    $('table#tbselectedrows').find("tr[manufacturer='" + param_manufacturer + "'][model='" + param_model + "'][partnumber='" + param_partnumber + "']").find("td[class=\"tdcartridge\"] input").val('');
    $('table#tbselectedrows').find("tr[manufacturer='" + param_manufacturer + "'][model='" + param_model + "'][partnumber='" + param_partnumber + "']").find("td[class=\"tdcartridge\"] input").val(incrementedvalue);

    ChangeMonthlySavingsCalculation(param_manufacturer, param_model, param_partnumber, incrementedvalue, currentvalue, 'increment');

    return false;

}


function ChangeMonthlySavingsCalculation(tbmanufacturer, tbmodel, tbpartnumber, cartridgepermonth, param_currentvalue, param_operatorflag) {

    //get the catridge value entered by the user
    $('table#tbselectedrows').find("tr[manufacturer='" + tbmanufacturer + "'][model='" + tbmodel + "'][partnumber='" + tbpartnumber + "']").find("td[class=\"tdcartridge\"] input").val(cartridgepermonth);

    //get OEC & XRC Cost value from XML for the corresponding selection
    //$.get("Reseller.xml", function (xml) {

        $(xml).find("Manufacturer").each(function () {

            var manufacture = $(this).attr('value');

            if (tbmanufacturer == manufacture) {

                $(this).find('Model').each(function () {

                    var model = $(this).attr('value');

                    if (tbmodel == model) {

                        $(this).find('PartNumber').each(function () {

                            var partnumber = $(this).attr('OEMPartNumber');

                            if (tbpartnumber == partnumber) {

                                var OEM_Cost = $(this).attr('OEMCost');
                                var XRC_Cost = $(this).attr('XRCCost');
                                var OEM_Cartridge = $(this).attr('OEMCartridge');
                                var XRC_Cartridge = $(this).attr('XRCCartridge');

                                //calculate the total savings
                                var defaultmonthlysavings = (defaultcartridgepermonth * OEM_Cartridge / XRC_Cartridge) * XRC_Cost - (defaultcartridgepermonth * OEM_Cost);

                                var calculatedmonthlysavings = (cartridgepermonth * OEM_Cartridge / XRC_Cartridge) * XRC_Cost - (cartridgepermonth * OEM_Cost);
                                var roundedcalculatedmonthlysavings = roundNumber(calculatedmonthlysavings, 2);

                                var removenegvalue = roundNumber(Math.abs(roundedcalculatedmonthlysavings), 2);

                                if (csymbol == '€')
                                    removenegvalue = removenegvalue.replace('.', ',');

                                //change the calculated value to  corresponding monthly savings
                                $('table#tbselectedrows').find("tr[manufacturer='" + tbmanufacturer + "'][model='" + tbmodel + "'][partnumber='" + tbpartnumber + "']").find("td[class=\"tdmonthlysaving\"] label").text('');

                                if (calign.toLowerCase() == 'yes')
                                    $('table#tbselectedrows').find("tr[manufacturer='" + tbmanufacturer + "'][model='" + tbmodel + "'][partnumber='" + tbpartnumber + "']").find("td[class=\"tdmonthlysaving\"] label").text(removenegvalue + ' ' + csymbol);
                                else
                                    $('table#tbselectedrows').find("tr[manufacturer='" + tbmanufacturer + "'][model='" + tbmodel + "'][partnumber='" + tbpartnumber + "']").find("td[class=\"tdmonthlysaving\"] label").text(csymbol + ' ' + removenegvalue);

                                //also append the calculated savings attr to the delete row function as a parameter
                                var deletefunction = "<td class=\"tddelete\"><img src=\"Images/delete.png\" onclick=\"javascript:return DeleteRow('" + tbmanufacturer + "','" + tbmodel + "','" + tbpartnumber + "','" + removenegvalue + "');\"/></td>";

                                $('table#tbselectedrows').find("tr[manufacturer='" + tbmanufacturer + "'][model='" + tbmodel + "'][partnumber='" + tbpartnumber + "']").find("td[class=\"tddelete\"]").remove();
                                $('table#tbselectedrows').find("tr[manufacturer='" + tbmanufacturer + "'][model='" + tbmodel + "'][partnumber='" + tbpartnumber + "']").append(deletefunction);

                                //show total monthly savings
                                var total = TotalSavingsCalc(defaultmonthlysavings, param_operatorflag, param_currentvalue);
                                if (csymbol == '€')
                                    total = total.replace('.', ',');

                                if (calign.toLowerCase() == 'yes')
                                    $('#lbltotalsavings').val(total + ' ' + csymbol);
                                else
                                    $('#lbltotalsavings').val(csymbol + ' ' + total);

                                $('.totalsavings').show();
                            }
                        });
                    }
                });
            }
        });
    //});
}

function DeleteRow(param_manufacturer, param_model, param_partnumber, param_monthlysavings) {

    jQuery("#trappendedrow").removeAttr("manufacturer", selectedmanufacturer);
    jQuery("#trappendedrow").removeAttr("model", selectedmodel);
    jQuery("#trappendedrow").removeAttr("partnumber", selectedpartnumber);
    $('table#tbselectedrows').find("tr[manufacturer='" + param_manufacturer + "'][model='" + param_model + "'][partnumber='" + param_partnumber + "']").remove();

    //show total monthly savings
    var total = TotalSavingsCalc(param_monthlysavings, 'delete', 0);
    if (csymbol == '€')
        total = total.replace('.', ',');

    if (calign.toLowerCase() == 'yes')
        $('#lbltotalsavings').val(total + ' ' + csymbol);
    else
        $('#lbltotalsavings').val(csymbol + ' ' + total);
    $('.totalsavings').show();

    return false;
}


var totalMonthlySavings = 0;

function TotalSavingsCalc(param_monthlysavings, param_flag, param_inputvalue) {

    if (param_flag == 'add') {
        totalMonthlySavings = totalMonthlySavings + Math.abs(param_monthlysavings);
    }
    else if (param_flag == 'delete') {
        totalMonthlySavings = Math.abs(totalMonthlySavings) - Math.abs(param_monthlysavings);
    }
    else if (param_flag == 'increment') {
        if (param_inputvalue <= 0)
            totalMonthlySavings = Math.abs(totalMonthlySavings) + (param_monthlysavings);
        else
            totalMonthlySavings = Math.abs(totalMonthlySavings) + Math.abs(param_monthlysavings);
    }
    else if (param_flag == 'decrement') {
        if (param_inputvalue < 0)
            totalMonthlySavings = Math.abs(totalMonthlySavings) + Math.abs(param_monthlysavings);
        else
            totalMonthlySavings = Math.abs(totalMonthlySavings) + (param_monthlysavings);
    }

    var roundedcost = roundNumber(totalMonthlySavings, 2);
    var absoluteroundedcost = roundNumber(Math.abs(roundedcost), 2);

    return absoluteroundedcost;
}
