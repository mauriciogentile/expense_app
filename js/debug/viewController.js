ViewController = function (view) {

	var self = this;
	var view = view;

	var storage = new ExpenseStorage();
	var config = new Kido("local").config();
	
	var settings = new Array();

	self.init = function() {
		$(document).ready(function () {

			self.getConfig();
			self.initView();
			view.showLoginPage();

			$("#btnSignIn").click(function() {
				view.showHomePage();
			});

			$("[data-icon='home']").click(function() {
				view.showHomePage();
			});

			$("[data-icon='back']").click(function() {
				view.goBack();
			});

			$("#btnAddExpense").click(function() {
				self.showExpenseTypes();
			});

			$("#btnShowExpenseTypes").click(function() {
				self.showExpenseTypes();
			});

			$("#btnCloseTimeReport").click(function() {
				self.closeTimeReport();
			});

			$("#btnSaveExpense").click(function() {
				self.saveExpense();
			});

			$("#btnShowTimeReports").click(function() {
				self.showTimeReports();
			});
		});
	};

	self.initView = function() {
		//load projects
		view.showLoading();
		var getProjects = storage.getAll("projects");
		getProjects.done(function(result) {
			view.projects(result);
		});
		getProjects.fail(function() {
			view.showMessage("error loading projects");
		});
		getProjects.always(function() {
			view.hideLoading();
		});
		self.setExpenseTypes();
	};

	self.getConfig = function() {
		view.showLoading();
		var get = config.getAll();
		get.done(function(result) {
			$(result).each(function(index, item) {
				settings[item.name] = item.data;
			});
		});
		get.fail(function(error) {
			view.showMessage("error retrieving configuration");
			logError("an error occured while accessing configuration: " + JSON.stringify(error));
		});
		get.always(function() {
			view.hideLoading();
		});
	};

	self.showExpenseTypes = function() {
		self.setExpenseTypes();
		view.showExpenseTypesPage();
	};

	self.setExpenseTypes = function() {
		var expenseTypes = view.cachedExpenseTypes();
		if(expenseTypes) {
			return;
		}
		view.showLoading();
		var query = storage.query({}, {Description:1,Icon:1,IsQuick:1}, "expenseTypes");
		query.done(function(data) {
			$.each(view.expenseTypes(data), function(index, child) {
				$(child).click(function(sender) {
					self.addOrEditExpense($(sender.currentTarget).attr("id"));
				});
			});
			var quickExpenseTypes = new Array();
			$.each(data, function(index, item) {
				if(item.IsQuick) {
					quickExpenseTypes.push(item);
				}
			});
			view.quickExpenseTypes(quickExpenseTypes);
			$("#quickExpenseTypes").children("a[expenseTypeId]").click(function(sender) {
				var expenseTypeId = $(sender.currentTarget).attr("expenseTypeId");
				self.addOrEditExpense(expenseTypeId);
			});
		});
		query.fail(function(e) {
			view.showMessage("Error retrieving expense types");
		});
		query.always(function() {
			view.hideLoading();
		});
	};

	self.showTimeReports = function() {
		view.showLoading();
		var get = storage.getAll("timeReports");
		get.done(function(data) {
			$.each(view.timeReports(data), function(index, child) {
				$(child).click(function(sender) {
					var id = $(sender.currentTarget).attr("id");
					self.setExpensesForTimeReport(id);
				});
			});
			view.showTimeReportsPage();
		});
		get.fail(function(e) {
			view.showMessage("Error retrieving expense types");
		});
		get.always(function() {
			view.hideLoading();
		});
	};

	self.addOrEditExpense = function(expenseTypeId, expenseId) {
		view.showLoading();
		var getExpenseTypes = storage.getById(expenseTypeId, "expenseTypes");
		getExpenseTypes.done(function(expenseType) {
			view.resetExpenseForm();
			view.expenseType(expenseType);
			view.expenseFields(expenseType.Fields);
			if(expenseId) {
				self.editExpense(expenseId);
			}
			view.showExpenseFormPage();
		});
		getExpenseTypes.fail(function(){
			view.showMessage("error getting expense type");
		});
		getExpenseTypes.always(function() {
			view.hideLoading();
		});
	};

	self.editExpense = function(expenseId) {
		view.showLoading();
		var getExpense = storage.getById(expenseId, "expenses");
		getExpense.done(function(expense) {
			view.expense(expense);
		});
		getExpense.fail(function(){
			view.showMessage("error getting expense");
		});
		getExpense.always(function() {
			view.hideLoading();
		});
	};

	self.saveExpense = function() {
		view.showLoading();

		var expense = view.expense();
		var expenseDate = new Date(expense.Date).format("isoUtcDateTime");
		var where = {$and:[{StartDate:{$lt: expenseDate }},{EndDate:{$gt: expenseDate }}]};

		var query = storage.query(where, {}, "timeReports");
		query.done(function(timeReports) {
			var timeReport = timeReports[0];
			expense.TimeReportId = timeReport._id;
			self.saveExpenseInternal(expense);
		});
		query.fail(function(e) {
			view.showMessage("error saving expense");
			view.hideLoading();
		});
		query.always(function() {
			view.hideLoading();
		});
	};

	self.saveExpenseInternal = function(expense) {
		view.showLoading();
		var save = storage.save(expense, "expenses");
		save.done(function() {
			view.showMessage("expense saved!");
			view.showHomePage();
		});
		save.fail(function() {
			view.showMessage("error saving expense");
		});
		save.always(function() {
			view.hideLoading();
		});
	};

	self.createTimeReport = function(date) {
	};

	self.setExpensesForTimeReport = function(id) {
		self.setExpenseTypes();

		view.showLoading();

		self.setTimeReport(id);
		var getExpenses = storage.query({TimeReportId:id}, {}, "expenses", false);
		getExpenses.done(function(expenses) {
			$.each(view.expenses(expenses), function(index, child) {
				var expenseTypeId = $(child).attr("expenseTypeId");
				var expenseTypes = view.cachedExpenseTypes();
				if(expenseTypes) {
					$(child).find("img").attr("src", expenseTypes[expenseTypeId]);
				}
				$(child).click(function(sender) {
					var target = $(sender.currentTarget);
					var expenseId = target.attr("id");
					var expenseTypeId = target.attr("expenseTypeId");
					self.addOrEditExpense(expenseTypeId, expenseId);
				});
			});
			view.showExpensesPage();
		});
		getExpenses.fail(function(){
			view.showMessage("error getting expense type");
		});
		getExpenses.always(function() {
			view.hideLoading();
		});
	};

	self.setTimeReport = function(id) {
		view.showLoading();
		var get = storage.getById(id, "timeReports");
		get.done(function(timeReport) {
			view.timeReport(timeReport);
		});
		get.fail(function(){
			view.showMessage("error getting time report");
		});
		get.always(function() {
			view.hideLoading();
		});
	};

	self.closeTimeReport = function() {
		var timeReport = view.timeReport();
		view.showLoading();
		var endDateFormatted = new Date(timeReport.EndDate).format(dateFormat.masks.us);
		var from = settings["smtpfrom"];
		var to = settings["smtpto"];
		var subject = "Expense App - Period closed: " + endDateFormatted;
		var html = "<p>Period <strong>" + endDateFormatted + "</strong> has been closed and won't be able to be modified without approval.</p>";

		var send = new Kido("local").email().send(from, to, subject, null, html);
		send.done(function() {
			view.showMessage("Mail sent to " + to + ": " + subject);
			self.showTimeReports();
		});
		send.fail(function(e) {
			view.showMessage("error sending e-mail: " + JSON.stringify(e));
		});
		send.always(function() {
			view.hideLoading();
		});
		
		/*queue.push(self.selectedPeriod())
			.done(function() {
				 self.showMessage("Notification sent to queue 'periods'");
			});*/
	};
};