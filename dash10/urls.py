from django.conf.urls import url
from . import views
  
urlpatterns = [
	url(r'^$', views.index , name = 'index'),
	url(r'^dbs/$', views.dbs , name = 'dbs'),
	url(r'^getcolumns/$', views.getcolumns , name = 'getcolumns'),
	url(r'^plot/$', views.plot , name = 'plot'),
	url(r'^table/$', views.table , name = 'table'),
	url(r'^signup/$', views.signup , name = 'signup'),
	url(r'^signin/$', views.signin , name = 'signin'),
	url(r'^signup/create/$', views.signupcreate , name = 'signupcreate'),
	url(r'^signin/user/$', views.signinuser , name = 'signinuser'),
	url(r'^logout/$', views.logout , name = 'logout'),
	url(r'^dbhelper/$', views.dbhelper , name = 'dbhelper'),
	url(r'^plotpage/(?P<selectedplot>\d+)/$', views.plotpage , name = 'plotpage'),
	url(r'^report/$', views.report , name = 'report'),
	url(r'^savereport/$', views.savereport , name = 'savereport'),
	url(r'^applyfilters/$', views.applyfilters , name = 'applyfilters'),
    url(r'^dbconn/$', views.dbconn , name = 'dbconn'),
	url(r'^dbconnadd/$', views.dbconnadd , name = 'dbconnadd'),
	url(r'^myreports/$', views.myreports , name = 'myreports'),
    url(r'^customsql/$', views.customsql , name = 'customsql'),
    url(r'^datamodel/$', views.datamodel , name = 'datamodel'),
    url(r'^savedatamodel/$', views.savedatamodel , name = 'savedatamodel'),
    url(r'^importdatamodel/(?P<datamodel>[\w\-]+)/$', views.importdatamodel , name = 'importdatamodel'),
	url(r'^query/$', views.query , name = 'query'),
	url(r'^opensavedreport/$', views.opensavedreport , name = 'opensavedreport'),
	url(r'^createdashboard/$', views.createdashboard , name = 'createdashboard'),
	url(r'^mydatamodels/$', views.mydatamodels , name = 'mydatamodels'),
	url(r'^savedashboard/$', views.savedashboard , name = 'savedashboard'),
	url(r'^importdashboard/(?P<dashboard>[\w\-]+)/$', views.importdashboard , name = 'importdashboard'),
	url(r'^mydashboards/$', views.mydashboards , name = 'mydashboards'),
] 
