 

/***********************  AJAX METHODS  **********************/


//    GLOBAL VARIABLES
var map = 'bar';            //  CURRENT SELECTED PLOT METHOD (DEFUALT BAR)
var headers = [];           //  STORES THE LIST OF COLUMNS DRAG AND DROP TABLE VIEW
var tables = [];            //   STORES THE LIST OF TABLE NAME
var maps = ['bar']
var filters_type = []
var filters_val = []




//  DATA MODELING VARIABLES
var tabledlg = 1;
var joindlg = 1;
var noofclass = 1;
var tablesadded = [];
var classes = [];
var objects = [];
var types = [];
var keys = [];
var subjectarea = [];
var querycols = [];


//  DASHBOARD VARIABLES
var plotdlg = 1;
var selectedplot = 1;
var states = {};
var datatypes = [];












/********************************  DATA MODEL AJAX METHODS   *********************************/



// ADD A CLASS TO THE UNIVERSE
function addsubjectarea(sa = "def") {
    var subname = "";
    if(sa == "def")
        subname = document.getElementById('subjectareaname').value;
    else subname = sa;
    subjectarea.push(subname);
    str = '<li id="lisa'+subname+'" class="has-sub"><a class="js-arrow" href="#"><i class="fas fa-desktop" style="margin-right:5px;"></i>'+subname+'</a><ul style="min-height:200px;width:100%;max-height:600px;padding-left:50px;" id="sa'+subname+'" ondrop="dropcolumns(event)" ondragover="allowdropcolumns(event)" class="list-unstyled js-sub-list"></ul></li>'
    document.getElementById('universe').innerHTML += str;
    noofclass++;
}


// ADD A TABLE TO THE JOIN AREA
function addtables(tables) {
    for(var i=1;i<=tables.length;i++) {
        var table = tables[i];
        var ele = document.getElementById('imptb'+table);
        if(ele.checked == true && !elementExists(tablesadded, i)){
            // // console.log("tablesaddedtablesadded")
            droptables(ele.value, tabledlg);
            tablesadded.push(i);
            tabledlg++;
        }
    }
}


// HANDLING DROP TABLE ON THE JOIN AREA
function droptables(table,dlg) {
    $.ajax({
        type : 'POST',
        url : '/dash10/getcolumns/',
        data : {
            tb : table,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
            str = "";
            for(var i=0;i<data[0].length;i++) {
                str += '<li class="has-sub columndialogs" id="col'+table+'_'+data[0][i]+'" draggable = "true" ondragstart="dragcolumns(event,&quot;'+table+'&quot;,&quot;'+data[0][i]+'&quot;,&quot;'+data[1][i]+'&quot;,&quot;'+data[2][i]+'&quot;)"><a class="js-arrow" style="color: #3B5998;" href="#"><i class="fas fa-table" style="margin-right:5px;"></i>'+data[0][i]+'</a></li>';
            }
            document.getElementById('joinarea').innerHTML += '<ul id="dialog'+table+'" title="'+table+'" class="list-unstyled js-sub-list  text-white tabledialogs" style="width:100%;border: 1px solid #3B5998;background-color: #fff;color: #3B5998;">'+str+'</ul>';
            addtabledialog(table);
        }
    });

}



//  ADD DAILOG BOX
function addtabledialog(table) {
    $(function() {
        $("#dialog"+table).dialog({
            minHeight:200,
            maxHeight : 800,
            position: { my: "left", at: "left+300 middle" }
            // drag: function( event, ui ) {
            //     jointhetables(1);
            // }
        });
        // // console.log("dlg" +table);
    });
}



// ADD A JOIN CONDITION TO CONDITION AREA
function addjoin() {
    // // console.log(joindlg);
    document.getElementById('joindialog'+joindlg).style.display = 'block';
    $('#joindialog'+joindlg).dialog({
        position: { my: "left", at: "left+350 bottom-150" },
        width : 400
    });
    joindlg++;
}





// GET COLUMN NAMES OF A TABLE IN THE JOIN CONDITIONS
function getcolumnsinjoincondition(tb,id,dlg) {
    $.ajax({
        type : 'POST',
        url : '/dash10/getcolumns/',
        data : {
            tb : tb,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
            var str = "";
            for(var i=0;i<data[0].length;i++) {
            str += '<option value="'+data[0][i]+'">'+data[0][i]+'</option>';
            }
            document.getElementById(id+'columnselect'+dlg).innerHTML = str;
        }
    });
}


function jointhetables(iter) {

    for(var ii=1;ii<iter;ii++) {
        // // console.log("line" + ii);
    var tb1 =  document.getElementById('firsttableselect'+ii).value;
    var tb2 = document.getElementById('secondtableselect'+ii).value;
    var col1 = document.getElementById('firstcolumnselect'+ii).value;
    var col2 = document.getElementById('secondcolumnselect'+ii).value;
    var class1 = '.tabledialogs';
    var line = '#line'+ii;
    document.getElementById('line'+ii).style.display = 'block';

    addconnection('#dialog'+tb1,'#dialog'+tb2,class1,line);
    //addcolors('col'+tb1+'_'+col1, 'col'+tb2+'_'+col2);
    document.getElementById('joinbtn').click();

}
}



function addcolors(id1,id2) {
    document.getElementById(id1).style.backgroundColor = "lightblue";
    document.getElementById(id2).style.backgroundColor = "lightblue";
}


function addconnection(id1,id2,class1,line) {
    console.log(id1 + " " + id2);
    console.log(line);
    var boxCenterXOffset = 20;
    var boxCenterYOffset = 0;
    var x1 = $(id1).offset().left + boxCenterXOffset;
    var x2 = $(id2).offset().left + boxCenterXOffset;
    var y1 = $(id1).offset().top + boxCenterYOffset;
    var y2 = $(id2).offset().top + boxCenterYOffset;

    // // console.log(x1);
    // // console.log(y1);
    // // console.log(x2);
    // // console.log(y2);

    var hypotenuse = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));

    // // console.log("hyp" + hypotenuse);
    var angle = Math.atan2((y1-y2), (x1-x2)) *  (180/Math.PI);

    // // console.log("angle" + angle);
    if(angle >= 90 && angle < 180){
        y1 = y1 - (y1-y2);
    }
    if(angle > 0 && angle < 90){
        x1 = x1 - (x1-x2);
        y1 = y1 - (y1-y2);
    }
    if(angle <= 0 && angle > -90){
        x1 = x1 - (x1-x2);
    }

    $(line).queue(function(){
        $(this).offset({top: y1, left: x1});
        $(this).dequeue();
    }).queue(function(){
        $(this).width(hypotenuse);
        $(this).dequeue();
    }).queue(function(){
        $(this).rotate(angle);
        $(this).dequeue();
    });
}



// HANDLING DRAG EVENTS OF THE COLUMNS 
function dragcolumns(ev,tb,col,dt,key) {
    ev.dataTransfer.setData("table", tb);
    ev.dataTransfer.setData("colname", col);
    ev.dataTransfer.setData("datatype", dt);
    ev.dataTransfer.setData("key", key);
}




// ALLOW TO DROP COLUMNS IN THE UNIVERSE
function allowdropcolumns(ev) {
    ev.preventDefault();
}



// HANDLING DROP COLUMN EVENTS IN THE UNIVERSE
function dropcolumns(ev) {
    ev.preventDefault();
    var table = ev.dataTransfer.getData("table");
    var colname = ev.dataTransfer.getData("colname");
    var type = ev.dataTransfer.getData("datatype");
    var key = ev.dataTransfer.getData("key");
    classes.push(table);
    objects.push(colname);
    types.push(type);
    keys.push(key);

    document.getElementById(ev.target.id).innerHTML += "<li title='"+type+"' id='"+colname+"'><i class='fas fa-columns' style='margin-right:5px;'></i>"+colname+"</li>";
}



// SAVE MODEL IN THE CSV FORMAT
function savedatamodel(classes, objects, datatypes, keys) {
    var jointables = [];
    var joincolumns = [];
    var filename = document.getElementById('datamodelname').value;
    for(var i=1;i<joindlg;i++) {
        var tb1 = document.getElementById('firsttableselect'+i).value;
        var tb2 = document.getElementById('secondtableselect'+i).value;
        var col1 = document.getElementById('firstcolumnselect'+i).value;
        var col2 = document.getElementById('secondcolumnselect'+i).value;

        jointables.push(tb1);
        jointables.push(tb2);
        joincolumns.push(col1);
        joincolumns.push(col2);
    }
    // console.log(classes);
    // console.log(objects);
    // console.log(types);
    // console.log(keys);
    // console.log(jointables);
    // console.log(joincolumns);
    // console.log(subjectarea);
    $.ajax({
        type : 'POST',
        url : '/dash10/savedatamodel/',
        data : {
            'classes[]' : classes,
            'objects[]' : objects, 
            'types[]' : types,
            'keys[]' : keys,
            'jointables[]' : jointables,
            'joincolumns[]' : joincolumns,
            'subjectarea[]' : subjectarea,
             filename : filename,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            alert(data);
        }
    });
}




function importdatamodel(filename = "def",username = "def") {
    if(filename != "def") {
        var filepath = './dash10/static/uploads/'+username+'/datamodel/'+filename+'.csv';
        var joinpath = './dash10/static/uploads/'+username+'/datamodel/'+filename+'join.csv';
    }else{
        var filepath = document.getElementById('selectdatamodel').value;
        var joinpath = document.getElementById('selectdatamodeljoin').value;
    }
    $.ajax({
        type : 'POST',
        url : '/dash10/importdatamodel/def/',
        data : {
            'filepath' : filepath,
            'joinpath' : joinpath,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
            for(var i=0;i<data[1].length;i++) {
                droptables(data[1][i], tabledlg);
                tabledlg++;
            }
            for(var i=0,k=0;i<data[6].length/2;i++,k+=2) {
                addjoin();
                columnsget(data[6][k], 'first', i+1);
                columnsget(data[6][k+1], 'second', i+1);
            }
            for(var i=0,k=0;k<data[6].length;i++,k+=2) {
                setSelectedValue(document.getElementById('firsttableselect' + (i+1)), data[6][k]);
                setSelectedValue(document.getElementById('secondtableselect' + (i+1)), data[6][k+1]);
                setSelectedValue(document.getElementById('firstcolumnselect' + (i+1)), data[7][k]);
                setSelectedValue(document.getElementById('secondcolumnselect' + (i+1)), data[7][k+1]);
                alert(data[7][k]);
                alert(data[7][k+1]);
            }
            addsubjectarea(data[0]);
            for(var i=0;i<data[3].length;i++) {
                document.getElementById('sa' + data[0]).innerHTML += '<li>'+data[3][i]+'</li>';
            }

        }
    });
}



//  ADD DAILOG BOX
function adddialog(dlg) {
    $(function() {
        $("#dialog"+dlg).dialog({
            maxHeight: 400,
        });
        // // console.log("dlg" +dlg);
    });
}

function columnsget(table, idd, ii) {
    $.ajax({
        type : 'POST',
        async: false,
        url : '/dash10/getcolumns/',
        data : {
            tb : table,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
            str = "";
            for(var i=0;i<data[0].length;i++) {
                str += '<option value="'+data[0][i]+'">'+data[0][i]+'</option>';
            }
            document.getElementById(idd + 'columnselect' + ii).innerHTML = str ;
        }
    });
}




// function droptableshybrid(table,dlg) {
//     document.getElementById('joinarea').innerHTML += '<ul id="dialog'+table+'" title="'+table+'" class="list-unstyled js-sub-list bg-dark text-white" style="z-index:1000000;"></ul>';
//     document.getElementById('dialog'+table).style.height = "400px";
//     addtabledialog(table);
// }





// function dropcolumnshybrid(tables,columns,typs) {
//     // console.log("hybridtable");
//     // console.log(types);
//     for(var i=0;i<tables.length;i++) {
//         document.getElementById('dialog' + tables[i]).innerHTML += '<li class="has-sub" id="col'+tables[i]+'_'+columns[i]+'" draggable = "true" ondragstart="dragcolumns(event,&quot;'+tables[i]+'&quot;,&quot;'+columns[i]+'&quot;,&quot;'+types[i]+'&quot;,&quot;'+typs[i]+'&quot;)"><a class="js-arrow text-white" href="#"><i class="fas fa-table" style="margin-right:5px;"></i>'+columns[i]+'</a></li>'
//         classes.push(tables[i]);
//         objects.push(columns[i]);
//         types.push(typs[i]);
//     }
// }



// function tablesget(tables, i) {
//     document.getElementById('firsttableselect'+i).innerHTML ="";
//     document.getElementById('secondtableselect'+i).innerHTML ="";
//     str = "";
//     for(var j=0;j<tables.length;j++) {
//         str += '<option value="'+tables[j]+'">'+tables[j]+'</option>';
//     }
//     //// // console.log(str);
//     document.getElementById('firsttableselect'+i).innerHTML += str;
//     // // console.log(str);
//     document.getElementById('secondtableselect'+i).innerHTML += str;
// }


// function columnsget(jointables, tables, columns) {

//     var k=1;
//     // // console.log("join table length" + jointables.length);
//     for(var i=0;i<jointables.length;i+=2) {
//         // // console.log("jointables " + jointables[i]);
//         // // console.log("jointables " + jointables[i+1]);
//         cols1 = columnsgethybrid(jointables[i],tables,columns);
//         cols2 = columnsgethybrid(jointables[i+1],tables,columns);
//         document.getElementById('firstcolumnselect'+k).innerHTML = "";
//         document.getElementById('secondcolumnselect'+k).innerHTML = "";
//         str = '';
//         for(var s=0;s<cols1.length;s++) str += '<option value="'+cols1[s]+'">'+cols1[s]+'</option>';
//         document.getElementById('firstcolumnselect'+k).innerHTML += str;
//         str = '';
//         for(var s=0;s<cols2.length;s++) str += '<option value="'+cols2[s]+'">'+cols2[s]+'</option>';
//         document.getElementById('secondcolumnselect'+k).innerHTML += str;
//         k+=1;
//         // // console.log("k " + k);

//     }

// }

// function columnsgethybrid(jointable, tables, columns) {
//     res = [];
//     for(var i=0;i<tables.length;i++) {
//         if(tables[i] === jointable) res.push(columns[i]);
//     }
//     return res;
// }

function setSelectedValue(selectObj, valueToSet) {
console.log(selectObj);
console.log(selectObj.options.length);
    for (var i = 0; i < selectObj.options.length; i++) {
    console.log(selectObj.options[i].text);
        console.log(valueToSet);
        if (selectObj.options[i].text== valueToSet) {

            selectObj.options[i].selected = true;
            return;
        }
    }
}

/********************************  /DATA MODEL AJAX METHODS   *********************************/









/****************************  REPORT METHODS  *************************/



function getcolumnsindbs(tb) {
    $.ajax({
            type : 'POST',
            url : '/dash10/getcolumns/',
            data : {
                tb : tb,
                csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
            },
            success : function(data) {

                //  ON SUCCESS
                data = JSON.parse(data);
                var str = "";
                for(var i=0;i<data[0].length;i++) {
                    str += '<li class="has-sub" draggable = "true" ondragstart="dragcols(event,&quot;'+tb+'&quot;,&quot;'+data[0][i]+'&quot;,&quot;'+data[1][i]+'&quot;)">'+
                                '<a class="js-arrow" href="#"><i class="fas fa-columns" style="margin-right:5px;"></i>'+data[0][i]+'</a>'+
                            '</li>'
                }
                document.getElementById('ulindbs'+tb).innerHTML = str;
            }
        });
}




/*************************** //// REPORT METHODS  *********************/












//    FUNCTION EXECUTE ON DOCUMENT READY
$(document).ready(function(){
    
    $('.responsive').slick({
    dots: false,
    arrows: true,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    vertical: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
    });

    $('.responsive1').slick({
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 5,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
});
 


// ADDING OF NEW TABLE TO TABLES
function droptable(tb) {

    //   PREVENT THE DEFUALT BEHAVIOUR

    var joinsec = document.getElementById('tablejoinarea');
    var joinsec1 = document.getElementById('querytablejoinarea');

    if(joinsec1 !== null){

        comparators = ['>', '<', '=', '!=', '>=', '<='];
        var str = "<option value='0'>Please Select Comparator</option>";
        for(var i=0;i<comparators.length;i++) {
            str += "<option value='"+comparators[i]+"'>"+comparators[i]+"</option>";
        }
        querycols.push(tb);
        fstring = "<div class='col-2 mx-2 my-1 mybtn' style='border-radius: 5px;background-color: #fff;color: #3B5998;'><div class='form-group'><label for='hostname' class=' form-control-label my-1' style='font-size: 16px;'>"+tb;
        fstring += "</label><div class='row'><div class='col-12 col-md-6'><select name='dbtype' id='select' class='form-control'>"+str;
        fstring += "</select></div><div class='col-12 col-md-6'><input type='text' id='hostname' name='host' placeholder='Value' class='form-control'></div></div></div></div>"

        joinsec1.innerHTML += fstring;
    }
    else{
        $.ajax({
            type : 'POST',
            url : '/dash10/getcolumns/',
            data : {
                tb : tb,
                csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
            },
            success : function(data) {

                //  ON SUCCESS
                data = JSON.parse(data);
                var str = "";
                for(var i=0;i<data.length;i++) {
                str += "<option value='"+data[i]+"'>"+data[i]+"</option>";
                }
                joinsec.innerHTML += "<div id='div"+tb+"' class='col-md-2'><center><p>"+tb+"</p><select name='"+tb+"' id='"+tb+"1' class='form-control-sm bg-dark text-white'>"+str+"</select></center></div>";
            }
        });
    }
}


//     ALLOW TO DROP TABLE IN THE PLOT AREA
function allowDropcols(ev) {
    ev.preventDefault();
}



//    HANDLING DRAG EVENT OF TABLES
function dragcols(ev,tb,col,dt) {
    ev.dataTransfer.setData("colname", col);
    ev.dataTransfer.setData("datatype", dt);
    ev.dataTransfer.setData("tablename", tb);

}



function dropcols(ev) {
     ev.preventDefault();
    var colname = ev.dataTransfer.getData("colname");
    var tbname = ev.dataTransfer.getData("tablename");
    var dt = ev.dataTransfer.getData("datatype");


    //  ADDING COLUMNS TO DROPCOLUMNS AREA
    var str = "<button id='"+tbname+"_"+colname+"' class='mybtn mt-3 ml-2' onclick='removethis(&quot;"+tbname+"&quot;,&quot;"+colname+"&quot;,&quot;"+dt+"&quot;)' style='padding : 1px 15px;border-radius: 5px;'><small>"+colname+"</small></button>";
    document.getElementById('dropcolumnsarea').innerHTML += str;



    headers.push(colname);
    tables.push(tbname);
    datatypes.push(dt);


//    // // console.log(headers);
//    // // console.log(tbname);



}




// ALLOW TO DROP COLUMNS ON THE PLOTTING AREA
function allowDrop(ev) {
    ev.preventDefault();
}



// HANDLING DRAG EVENTS OF THE COLUMNS
function drag(ev,tb) {
    ev.dataTransfer.setData("colname", ev.target.id);
    ev.dataTransfer.setData("tablename", tb);
}



// HANDLING DROP COLUMN EVENTS ON THE PLOTTING AREA
function drop(ev) {
    ev.preventDefault();
    var colname = ev.dataTransfer.getData("colname");
    var tbname = ev.dataTransfer.getData("tablename");
    var view = "view1";

    //  ADDING COLUMNS TO DROPCOLUMNS AREA
    var str = "<button id='"+tbname+"_"+colname+"' class='mt-2 ml-5 mybtn' onclick='removethis(&quot;"+tbname+"&quot;,&quot;"+colname+"&quot;)' style='padding : 1px 15px;border-radius: 5px;'><p style='font-size: 16px;'>"+colname+"</p></button>";
    document.getElementById('dropcolumnsarea').innerHTML += str;


    var joinsec1 = document.getElementById('querytablejoinarea');

    if(joinsec1 !== null){
        if(!elementExists(headers, colname))
        {
            //droptable(colname);

            headers.push(colname);
            tables.push(tbname);
        }
    }
    else{
        // ADDING UNIQUE TABLE NAMES TO JOIN AREA
        if(!elementExists(tables,tbname))
            droptable(tbname);

        headers.push(colname);
        tables.push(tbname);
    }
}


function dropqueryfilter(ev) {
    ev.preventDefault();
    var colname = ev.dataTransfer.getData("colname");
    var tbname = ev.dataTransfer.getData("tablename");
    var view = "view1";

    var joinsec1 = document.getElementById('querytablejoinarea');


    if(!elementExists(querycols, colname))
    {
        droptable(colname);
    }


}



// TABLE PLOTTING HELPER
function tableplottinghelper(tables,headers,f=0,group=0,order=0,limit=0,groupby='def',orderby='def',orderbyorder='def',lim='def') {
    var tbs = tables.filter( onlyUnique );
    cols = []
    for(var i=0;i<tbs.length;i++) {
        cols[i] = document.getElementById(tbs[i]+"1").value;
    }
    tableplotting(tables,headers,tbs,cols,group,order,limit,groupby,orderby,orderbyorder,lim,f);
}


// TABLE PLOTTING
function tableplotting(tables,headers,tbs,cols,group,order,limit,groupby,orderby,orderbyorder,lim,f=0){
    if(headers.length == 0) {
        document.getElementById('tablehead').innerHTML = "";
        document.getElementById('tablebody').innerHTML = "";
        return;
    }
    $.ajax({
        type : 'POST',
        url : '/dash10/table/',
        data : {
          'tables[]' : tables,
          'headers[]': headers,
          'tbs[]' : tbs,
          'cols[]' : cols,
          'group': group,
          'order': order,
          'limit': limit,
          'groupby': groupby,
          'orderby': orderby,
          'orderbyorder': orderbyorder,
          'lim': lim,
          csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data  = JSON.parse(data);
            str = "";
            for(var i=0;i<headers.length;i++) {
                str += "<th style='cursor:pointer;' ondblclick='removethis(&quot;"+headers[i]+"&quot;)'>"+tables[i]+"_"+headers[i]+"</th>";
            }
            var header = "<tr>"+str+"</tr>";
            var cells = "";
            for(var i=0;i<data[0].length;i++) {
                var cell = "";
                for(var j=0;j<headers.length;j++) {
                    cell += "<td>"+data[j][i]+"</td>";
                }
                cells += "<tr class='bg-secondary text-white'>"+cell+"</tr>";
            }
            document.getElementById('tablehead').innerHTML = header;
            document.getElementById('tablebody').innerHTML = cells;
            str = "";
            for(var i=0;i<headers.length;i++) {
                str += "<option values='"+tables[i]+"_"+headers[i]+"'>"+tables[i]+"_"+headers[i]+"</option>";
            }
            if(f==1){
                document.getElementById('orderby').innerHTML += str;
                document.getElementById('groupby').innerHTML += str;
            }
        }   
      });
}

function reportbycustomsql() {

    var x = document.getElementById("enteredsql").value;
    $.ajax({
        type : 'POST',
        url : '/dash10/customsql/',
        data : {
            x : x,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
//            // // console.log(Object.keys(data).length)
//            // // console.log(data[0])

            str = "";
            for(var i=0;i<data[0].length;i++) {
                str += "<th >"+data[0][i]+"</th>";
            }
            var header = "<tr>"+str+"</tr>";
            var cells = "";
            for(var i=0;i<data[1].length;i++) {
                var cell = "";
                for(var j=1;j<Object.keys(data).length;j++) {
                    cell += "<td>"+data[j][i]+"</td>";
                }
                cells += "<tr class='bg-secondary text-white'>"+cell+"</tr>";
            }
            document.getElementById('tablehead').innerHTML = header;
            document.getElementById('tablebody').innerHTML = cells;

        }
    });

}


// FUNCTION FOR DYNAMICALLY EXTRACTING COLUMN NAMES OF A TABLE
function getcolumns(tb) {
    $.ajax({
        type : 'POST',
        url : '/dash10/getcolumns/',
        data : {
            tb : tb,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
            var str = "";
            for(var i=0;i<data[0].length;i++) {
            str += "<li id='"+data[0][i]+"' draggable = 'true' ondragstart='drag(event,&quot;"+tb+"&quot;)'><i class='fas fa-columns' style='margin-right:5px;'></i>"+data[0][i]+"</li>";
            }
            document.getElementById(tb).innerHTML = str;
        }
    });
}






// APPLY VIEW FILTERS
function filters() {
    filter_type = [];
    filter_val = [];
    if(document.getElementById('aggfilter').value != 0) {
        filter_type.push('agg');
        filter_val.push(document.getElementById('aggfilter').value);
    }
    if(document.getElementById('minvalue').value != "") {
        filter_type.push('rng');
        filter_val.push(document.getElementById('minvalue').value + " " +document.getElementById('maxvalue').value);
    }
    // // console.log(filter_type);
    // // console.log(filter_val);
    cols = []
    for(var i=0;i<headers.length;i++) cols[i] = tables[i] + "_" + headers[i];
    $.ajax({
        type : 'POST',
        url : '/dash10/applyfilters/',
        data : {
            data : cols,
            filter_type : filter_type,
            filter_val : filter_val,
            fig_type : map,
            color : document.getElementById('colorpicker').value,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            document.getElementById('plotmap1').src = "/dash10/plotpage/";
        }
    });
}


function sessionupdate(dbname, dbtype){

    $.ajax({
    type : 'POST',
    url : '/dash10/dbconnadd/',
    data : {
        dbname : dbname,
        dbtype : dbtype,
        csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
    },
    success : function(data) {
        window.location="/dash10/datamodel/";
        }
    });
}







/************************  /AJAX METHODS   ***********************/












/*****************************   REPORT METHODS   **************************************/

// SAVE REPORT IN UPLOADS/USERNAME/REPORT
function savereport() {
    $.ajax({
        type : 'POST',
        url : '/dash10/savereport/',
        data : {
            filename : document.getElementById('filename').value + ".csv",
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
        }
    });
    document.getElementById('message').innerHTML = "Report Saved";
}


// OPENSAVEDREPORT
function opensavedreport(filename, username){

    $.ajax({
        type : 'POST',
        url : '/dash10/opensavedreport/',
        data : {
            filename : filename,
            username : username,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            window.location="/dash10/dbs/";
        }
    });
}


// APPLY MAIN FILTERS
function mainfilters() {
    var order=0,orderby='def',group=0,groupby='def',limit=0,lim='def',orderbyorder='def';
    if(document.getElementById('orderby').value != '0') {
        order = 1;orderby = document.getElementById('orderby').value;
        orderbyorder = document.getElementById('orderbyorder').value;
    }
    if(document.getElementById('groupby').value != '0') {
        group = 1;groupby = document.getElementById('groupby').value;
    }
    if(document.getElementById('limit').value != '') {
        limit = 1;lim = document.getElementById('limit').value;
    }
    tableplottinghelper(tables,headers,0,group,order,limit,groupby,orderby,orderbyorder,lim);
}

/**************************** QUERY METHODS *****************************************/

function queryfilteradd(reportname)
{
    g = document.getElementById("queryform");

    q = "SELECT ";
    for(var i=0; i<headers.length; i++){
            q += headers[i];
            if(i != headers.length - 1) q += ", ";
    }

    q += " FROM "+tables[0];

    if( querycols.length != 0) { q += " WHERE "; }

    for(var i=1; i< 2*querycols.length; i=i+2){

            if(g.elements[i].value == '0') { continue ;}
            q += querycols[Math.floor(i/2)]+g.elements[i].value+g.elements[i+1].value;

            if(i != 2*querycols.length - 1) q += " AND ";
//            else q += ";";
    }
    q+=';';

    // console.log(q);
    document.getElementById("divviewsqlindatamodel").innerHTML = q;

    $.ajax({
        type : 'POST',
        url : '/dash10/customsql/',
        data : {
            reportname : reportname,
            x : q,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
//            // console.log(Object.keys(data).length)
//            // console.log(arrayname.length)
            // console.log(data);
            if(Object.keys(data).length == 1) { alert("No Records with given parameters !"); }
            else {
                str = "";
                for(var i=0;i<data[0].length;i++) {
                    str += "<th >"+data[0][i]+"</th>";
                }
                var header = "<tr style='background-color:#3B5998;color: #fff;'>"+str+"</tr>";
                var cells = "";
                for(var i=0;i<data[1].length;i++) {
                    var cell = "";
                    for(var j=1;j<Object.keys(data).length;j++) {
                        cell += "<td>"+data[j][i]+"</td>";
                    }
                    cells += "<tr class='mybtn'>"+cell+"</tr>";
                }
                document.getElementById('tablehead').innerHTML = header;
                document.getElementById('tablebody').innerHTML = cells;
            }
        }
    });

}

function createreport(){

    x = document.getElementById("queryclassname").elements[1].value;




}

/**************************** /////REPORT METHODS   *********************************/









/*****************************   OTHER FUNCTIONS  *********************************/

// REMOVE A ELEMENT FROM THE ARRAY
function removeElement(array, elem) {  
    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
}


// ELEMENT EXISTS IN THE ARRAY
function elementExists(array, elem) {  
    for(var i=0;i<array.length;i++) {
        if(array[i] === elem) return true;
    }
    return false;
}


// REMOVE A COLUMN FROM THE TABLE ON DB CLICK
function removethis(tb,col) {
    for(var i=0;i<tables.length;i++) {
        if(tables[i] === tb && headers[i] === col) ind = i;
    }
    headers.splice(ind, 1);
    datatypes.splice(ind, 1);
    tables.splice(ind,1);
    document.getElementById(tb+"_"+col).style.display = "none";
}


// Output only unique values from the array
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

/*************************** ///OTHER FUNCTIONS *****************************/





/**************************   DASHBOARD VIEWS  **************************/


function importdashboard(file = "def",username = "def") {
    states = {}
    document.getElementById('iframeholder').innerHTML = "";
    document.getElementById('plotbtnsarea').innerHTML = "";
    document.getElementById('dropcolumnsarea').innerHTML = "";
    headers = [];
    tables = [];
    datatypes = [];
    func();
    if(file != "def") var path = './dash10/static/uploads/'+username+'/dashboard/'+file+'.csv';
    else var path = document.getElementById('selectdashboard').value;
    $.ajax({
        type : 'POST',
        url : '/dash10/importdashboard/def/',
        data : {
            'path': path,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
            states = data;
            console.log("states     " + states);
            // console.log("states" + Object.keys(data).length);
            for(var i=1;i<=Object.keys(data).length;i++) {
                addplot();
                selectplot(i);
                console.log("ïiiiiiiiiii   " +  i);
                headers = [states[i][0], states[i][1]];
                tables = [states[i][2], states[i][3]];
                datatypes = [states[i][4], states[i][5]];
                newplot(states[i][6], "#0000FF",tables,headers,datatypes);

            }
            selectplot(1);
            // console.log("a");
            // console.log(tables);
            // console.log(headers);
            // console.log(datatypes);
            // for(var i=1;i<=Object.keys(data).length;i++) {
                
            // }
            
            
        }
    });
    
}




function addplot() {
    document.getElementById('iframeholder').innerHTML += '<div class="bg-white" id="plotdialog'+plotdlg+'" title="Plot'+plotdlg+'" style="overflow-y:hidden;border: 1px solid #3B5998;"><iframe style="height:100%;width:100%;border: 2px solid #fff;" id="plotmap'+plotdlg+'" src=""></iframe></div>';
    addplotdlg(plotdlg);
    document.getElementById('plotbtnsarea').innerHTML += '<button id="plotbtn'+plotdlg+'" onclick="selectplot('+plotdlg+')" class="ml-5 mybtn" style="padding : 2px 15px;border-radius: 5px;">'+
                            '<i class="fas fa-bar-chart"></i>&nbsp;&nbsp;Plot'+plotdlg+'</button>'
    selectplot(plotdlg);
    document.getElementById('dropcolumnsarea').innerHTML = "";
    func();
    plotdlg++;

}

function selectplot(dlg) {
    // console.log(plotdlg);
    document.getElementById('dropcolumnsarea').innerHTML = "";
    func();
    tables = [];
    headers = [];
    datatypes = [];
    for(var i=1;i<plotdlg;i++) {
        // console.log("d");
        document.getElementById('plotbtn'+i).classList.remove("btn-info");
        document.getElementById('plotbtn'+i).classList.add("btn-secondary");
    }
    document.getElementById('plotbtn'+dlg).classList.add("btn-info");


    selectedplot = dlg;
    if(selectedplot in states) {
        state = states[selectedplot]
        c1 = state[0];
        c2 = state[1];
        t1 = state[2];
        t2 = state[3];
        dt1 = state[4];
        dt2 = state[5];
        met = state[6];
        
        // console.log(c1);
        // console.log(c2);
        // console.log(t1);
        // console.log(t2);
        // console.log(dt1);
        // console.log(dt2);
        // console.log(met);


        //  ADDING COLUMNS TO DROPCOLUMNS AREA
        var str = "<center><button id='"+t1+"_"+c1+"' class='btn-secondary mt-3' onclick='removethis(&quot;"+t1+"&quot;,&quot;"+c1+"&quot;)' style='padding : 1px 15px;border-radius: 5px;'><small>"+c1+"</small></button></center>";
        str += "<center><button id='"+t2+"_"+c2+"' class='btn-secondary mt-3' onclick='removethis(&quot;"+t2+"&quot;,&quot;"+c2+"&quot;)' style='padding : 1px 15px;border-radius: 5px;'><small>"+c2+"</small></button></center>";
        document.getElementById('dropcolumnsarea').innerHTML += str;


        func(met);
        tables.push(t1);tables.push(t2);
        headers.push(c1);headers.push(c2);
        datatypes.push(dt1);datatypes.push(dt2);
    }
}


function addplotdlg(dlg) {
    $(function() {
        $("#plotdialog"+dlg).dialog({
            minHeight : 300,
            minWidth : 600,
            width : 500,
            height : 600,
        });
        // // console.log("dlg" +dlg);
    });
}



// FUNCTION FOR CHAING THE STYLE OF MAP
function func(met = "def") {
    // console.log("called" + met)
    var a = ['bar','line','scatter','pie','histogram','heatmap']
    for(var i=0;i<a.length;i++) {
        document.getElementById(a[i]).style.backgroundColor = "#3B5998";
    }
    if(met != "def") {
        document.getElementById(met).style.backgroundColor = "gray";
    }
}



// MAPS PLOTTING
function newplot(met = "bar", color = "#06b9ce",tables,headers,datatypes) {
    func(met);
    map = met;
    console.log("newplot");
    console.log(tables);
    console.log(headers);
    console.log(datatypes);
    c1 = headers[0];    
    c2 = headers[1];
    t1 = tables[0];
    t2 = tables[1];
    dt1 = datatypes[0];
    dt2 = datatypes[1];
    // console.log(dt1);
    // console.log(dt2);
    // console.log(states);
    // // console.log(b);
    // if (b == '1'){
    //     // // console.log("bkgikg");
    //     c1 = headers[0];
    //     c2 = headers[1];
    // }

    // // console.log(b);
    // // console.log(c1);
    // // console.log(c2);


    //   CHECK FOR THIRD DIMENSION
    if(headers.length>2){
         c3 = headers[2];
         dt3 = datatypes[2];
    }
    else{
         c3 = "def";
         dt3 = "def";
    }
    tb = tables[0]; 
    states[selectedplot] = [c1,c2,t1,t1,dt1,dt2,met,c3,dt3];
    // // console.log(map);

    console.log("data sending..");
    console.log("c   " + c1 + "  " + c2);
    console.log("d   " + dt1 + "  " + dt2);
    console.log("t   " + tb);
    console.log("met   " + met);
    console.log("color  " + color);
    $.ajax({
        type : 'POST',
        url : '/dash10/plot/',
        data : {
            c1: c1,
            c2: c2,
            c3: c3,
            dt1 : dt1,
            dt2 : dt2,
            dt3 : dt3,
            tb: tb,
            mets: met,
            selectedplot : selectedplot,
            color: color,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            data = JSON.parse(data);
            console.log("selectedplot    " + data[1]);
            document.getElementById('plotmap' + data[1]).src = "/dash10/plotpage/"+data[1]+"/";
            document.getElementById('divviewsqlindbs').innerHTML = data[0];
        }
    });
}



function savedashboard() {
    data = JSON.stringify(states);
    filename = document.getElementById('dashboardname').value;
    $.ajax({
        type : 'POST',
        dataType: 'json',
        url : '/dash10/savedashboard/',
        data : {
            'filename': filename,
            'data' : data,
            csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val(),
        },
        success : function(data) {
            exportToJsonFile(states);
        }
    });
    
}

function exportToJsonFile(jsonData) {
    var dataStr = JSON.stringify(jsonData);
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    var exportFileDefaultName = 'data.json';
    
    var linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}



/*************************//// DASHBOARD VIEWS  *************************/