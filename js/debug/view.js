View = function () {

	var self = this;
	var selectedExpenseType = undefined;
	var selectedTimeReport = undefined;
	var selectedExpense = undefined;
	var cachedExpenseTypes = undefined;

	self.projects = function(projects) {
		var target = $("#expenseProject");
		if(projects) {
			target.empty();
			$("#lookupTemplate").tmpl(projects).appendTo(target);
		}
		return target.children();
	};

	self.expense = function(expense) {
		
		if(expense) {
			selectedExpense = expense;
			$("#expenseId").val(expense._id);
			$("#expenseDate").val(dateFormat(expense.Date, dateFormat.masks.us));
			updateSelect($("#expenseProject"), expense.ProjectCode);
			$("#expenseAmount").val(expense.TotalAmount);

			$.each(expense.Values, function(index, value) {
				var control = $("#" + value.Key).val(value.Value);
				if(control.selectmenu) {
					updateSelect(control, value.Value);
				}
			});

			return expense;
		}

		var expenseDate = new Date($("#expenseDate").val());
		var totalAmount = parseFloat($("#expenseAmount").val());

		var expense = {
			_id: $("#expenseId").val(),
			Claimed: false,
			CountryCode: "US",
			"Date": isNaN(expenseDate) ? new Date() : expenseDate,
			ExpenseTypeCode: selectedExpenseType.Code,
			ExpenseTypeDescription: selectedExpenseType.Description,
			ExpenseTypeId: selectedExpenseType._id,
			HasReceiptFile: false,
			IsReadOnly: false,
			IsSplit: false,
			PeriodEndDate: new Date(),
			ProjectCode: $("#expenseProject").val(),
			SequenceNumber: 0,
			Tax: 0.0,
			ToDate: new Date(),
			TotalAmount: isNaN(totalAmount) ? 0.0 : totalAmount,
			Values:[]
		};

		$.each($("#dynamic").find("select,input"), function(index, control) {
			expense.Values.push({Key:$(control).attr("id"), Value:$(control).val()});
		});

		if(selectedExpense && selectedExpense._id == expense._id) {
			expense._metadata = selectedExpense._metadata;
		}

		return expense;
	};

	self.resetExpenseForm  = function(expenses) {
		$("#expenseId").val('');
		$("#expenseDate").val(dateFormat(new Date(),dateFormat.masks.us));
		$("#expenseProject").val('');
		$("#expenseAmount").val(0.00);
		$("#dynamic").empty();
	};

	self.expenses = function(expenses) {
		var target = $("#expenses");
		if(expenses) {
			target.empty();
			$("#expensesTemplate").tmpl(expenses).appendTo(target);
		}
		return target.children();
	};

	self.quickExpenseTypes = function(expenseTypes) {
		var target = $("#quickExpenseTypes");
		if(expenseTypes) {
			target.empty();
			$("#quickExpenseTypesTemplate").tmpl(expenseTypes).appendTo(target);
			target.trigger("create");
		}

		return target.children();
	};

	self.expenseType = function(expenseType) {
		if(expenseType) {
			selectedExpenseType = expenseType;
			$("#expenseFormTitle").text(selectedExpenseType.Description);
			$("#expenseFormImage").attr("src", selectedExpenseType.Icon);
		}
		return selectedExpenseType;
	};

	self.timeReport = function(timeReport) {
		if(timeReport) {
			selectedTimeReport = timeReport;
			$("#timeReportTitle").text(dateFormat(timeReport.EndDate, dateFormat.masks.us));
		}
		return selectedTimeReport;
	};

	self.timeReports = function(timeReports) {
		if(timeReports) {
			var target = $("#timeReports");
			target.empty();
			$("#timeReportsTemplate").tmpl(timeReports).appendTo(target);
		}
		return $("#timeReports").children();
	};

	self.expenseFields = function(expenseFields) {
		var container = $("#dynamic");

		if(expenseFields) {
			container.empty();

			$.each(expenseFields, function(index, expenseField) {
				$.each(createControls(expenseField), function(index, control) {
					container.append(control);
				});
			});

			container.trigger("create");
		}
		return container.children();
	};

	self.expenseTypes = function(expenseTypes) {
		var target = $("#expenseTypeList");
		if(expenseTypes) {
			target.empty();
			$("#expenseTypesTemplate").tmpl(expenseTypes).appendTo(target);
			self.cachedExpenseTypes(expenseTypes);
		}
		return target.children();
	};

	self.cachedExpenseTypes = function(expenseTypes) {
		if(expenseTypes) {
			cachedExpenseTypes = new Array();
			$.each(expenseTypes, function(index, item) {
				cachedExpenseTypes[item._id] = item.Icon;
			});
		}
		return cachedExpenseTypes;
	};

	self.showMessage = function(message) {
		alert(message);
	};

	self.showLoading = function() {
		$.mobile.showPageLoadingMsg();
	};

	self.hideLoading = function() {
		$.mobile.hidePageLoadingMsg();
	};

	self.showExpenseTypesPage = function() {
		$.mobile.changePage("#expenseTypesPage");
	};

	self.showExpensesPage = function() {
		$.mobile.changePage("#expensesPage");
	};

	self.showTimeReportsPage = function() {
		$.mobile.changePage("#timeReportsPage");
	};

	self.showHomePage = function() {
		$.mobile.changePage("#homePage");
	};

	self.goBack = function() {
		self.showHomePage();
	};

	self.showLoginPage = function() {
		$.mobile.changePage("#loginPage");
	};

	self.showExpenseFormPage = function(category) {
		$.mobile.changePage("#expenseFormPage");
	};

	function createControls(expenseField) {
		var newControls = new Array(2);
		var types = [{}];

		type = expenseField.Type.replace("String","text");
		type = type.replace("Date","date");
		type = type.replace("Number","number");
		type = type.replace("Integer","number");
		type = type.replace("Decimal","number");
		type = type.replace("Boolean","checkbox");

		newControls[0] = $("<label></label>").text(expenseField.DisplayName);

		if(expenseField.ValidValues && expenseField.ValidValues.length > 0) {
			newControls[1] = $('<select id="' + expenseField.Key + '"></select>');
			$("#lookupTemplate").tmpl(expenseField.ValidValues).appendTo(newControls[1]);
		}
		else {
			newControls[1] = $('<input id="' + expenseField.Key + '" type="' + type +  '"></input>');
		}

		newControls[1].val(expenseField.DefaultValue);

		if(expenseField.ReadOnly) {
			newControls[1].addClass("ui-disabled");
		}

		if(type === "checkbox") {
			var wrapper = $('<div data-role="controlgroup"></div>');
			wrapper.append(newControls[1]);
			newControls[1] = wrapper;
		}

		return newControls;
	}

	function updateSelect(target, value) {
		target.val(value);
		target.children("option").removeAttr("selected");
		var filter = 'option[value="' + value + '"]';
		target.children(filter).attr("selected", true);
		try {
			target.selectmenu();
			target.selectmenu("refresh");
		}
		catch(err) {
		}
	}
}