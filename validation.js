//////////////////////////////////////////////////////////////////////////////////////
// validation.js
//
// Copyright (c) 2010, Alexander Blomen <info@ablomen.nl>			
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice, this
//   list of conditions and the following disclaimer in the documentation and/or 
//   other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
// IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
// POSSIBILITY OF SUCH DAMAGE.
//////////////////////////////////////////////////////////////////////////////////////
(function ($) {
	
	//
	// validate_text()
	// Validate a text field
	//
	var validate_text	=	function (element, object) {
		var valid	=	true;
		
		if (!element.el.val() || element.el.val() === element.message) {
			valid		=	false;
		}
		
		return valid; 
	},
	
	//
	// validate_email()
	// Validate an e-mail field (Note: this is no sophisticated validation, just checks for at least one @ and at least one .)
	//
	// TODO: sophisticated e-mail validation
	//
	validate_email		=	function (element, object) {
		var valid	=	true;
		
		if (!element.el.val() || element.el.val() === element.message || element.el.val().indexOf("@") < 0 || element.el.val().indexOf(".") < 0) {
			valid		=	false;
		}
		
		return valid; 
	},
	
	//
	// validate_checkbox()
	// Validate a checkbox
	//
	validate_checkbox	=	function (element, object) {
		var valid	=	true;
		
		if (!element.el.is(":checked")) {
			valid		=	false;
		}
		
		return valid; 
	},
	
	//
	// validate_radio()
	// Validate a radiobox
	//
	validate_radio		=	function (element, object) {
		var valid	=	false;
		
		$("input[type=radio][name=" + element.name + "]", object.el).each(function () {
			if ($(this).is(":checked")) {
				valid	=	true;
			}
		});
		return valid; 
	},
	
	//
	// validate_select()
	// Validate a selectbox
	//
	validate_select		=	function (element, object) {
		var valid	=	true;
		
		if (!element.el.val()) {
			valid		=	false;
		}
		
		return valid; 
	},
	
	//
	// output_class()
	// Add a class to the element if the element is not valid
	//
	output_class		=	function (element, object) {
		
		element.el.addClass(object.options.error_class);
		
		element.el.bind("click focus", function () {
			element.el.removeClass(object.options.error_class);
		});
		
	},
	
	//
	// output_inline()
	// Add a class and error message to the element if the element is not valid
	//
	output_inline		=	function (element, object) {
		
		element.el.addClass(object.options.error_class).val(element.message);
		
		element.el.bind("click focus", function () {
			element.el.removeClass(object.options.error_class).val("");
		});
		
	},
	
	//
	// output_append()
	// Append a character/piece of html to the elements parent if the element is not valid
	//
	output_append		=	function (element, object) {
		element.el.parent().find("." + object.options.error_append_class).remove();
		element.el.parent().append(
			$("<span/>").addClass(object.options.error_append_class).html(object.options.error_append_char)
		);
		
		element.el.bind("click focus", function () {
			element.el.parent().find("." + object.options.error_append_class).remove();
		});
	},
	
	//
	// output_parent()
	// Add a class to the elements parent if the element is not valid
	//
	output_parent		=	function (element, object) {
		element.el.parent().addClass(object.options.error_parent_class);
		
		element.el.parent().bind("click", function () {
			element.el.parent().removeClass(object.options.error_parent_class);
		});
	},
	
	//
	// output_alert()
	// Add text to the alert_message property of the ValidateForm/ValidateInput object if element is invalid
	//
	output_alert		=	function (element, object) {
		object.alert_message	+=	(element.message + "\r\n");
	},
	
	//
	// ValidateForm
	// Validate form elements
	//
	ValidateForm		=	function (element, options) {
		
		var self		=	this;
		self.el			=	element;
		self.elements		=	[];
		self.alert_message	=	"";
		
		//
		// The options
		//
		self.options		=	{
			callback:		false,
			required_class:		"validate_required",
			error_attribute:	"title",
			error_output:		{
				text:			"class",
				email:			"class",
				select:			"class",
				textarea:		"class",
				other:			"append"
			},
			error_class:		"validate_invalid",
			error_append_char:	" *",
			error_append_class:	"validate_invalid_append",
			error_parent_class:	"validate_invalid_parent",
			//
			// List of types of elements to validate and the function to validate them
			//
			types:			{
				text:			validate_text,
				email:			validate_email,
				checkbox:		validate_checkbox,
				radio:			validate_radio,
				select:			validate_select,
				textarea:		validate_text
			},
			//
			// List of output modules and the function to call them
			//
			output:			{
				"class":		output_class,
				inline:			output_inline,
				append:			output_append,
				alert:			output_alert,
				parent:			output_parent
			}
		};
		
		//
		// set_options()
		// Change options sent on initialization or by calling $(el).validate(options) after the initial ValidateForm object was initialized for the element
		//
		self.set_options	=	function (options) {
				
			var types, output;
			
			if (options) {
				
				if (options.types) {
					types	=	$.extend({}, self.options.types, options.types);
				}
				if (options.output) {
					output	=	$.extend({}, self.options.output, options.output);
				}
				$.extend(self.options, options);
				if (types) {
					self.options.types	=	types;
				}
				if (output) {
					self.options.output	=	output;
				}
			}
		};
		
		//
		// get_elements()
		// Get all the elements that have to be validated and create a list of them
		// Object tree:
		// array self.elements[
		//	object element{
		//		el:		jQuery object of the element
		//		name:		The name of the element
		//		message:	The error message, from the title attribute
		//		type:		The type of the element, either from: type attribute, select/textarea tag or from the validate_type_* class
		//		output:		The output type of the element, either from: the validate_output_* class or self.options.error_output.*
		//	}
		// ]
		//
		self.get_elements	=	function () {
			
			self.elements		=	[];
			
			$("." + self.options.required_class, self.el).each(function () {
				
				var classes, size, i,
				element		=	{};
				element.el	=	$(this);
				element.name	=	$(this).attr("name");
				element.message	=	$(this).attr(self.options.error_attribute);
				element.type	=	$(this).attr("type").toLowerCase();
				
				// Parse classes to find see if the element has a different then default output or type
				classes	=	$(this).attr("class").split(" ");
				size	=	classes.length;
				
				for (i = 0; i < size; i += 1) {
					if (classes[i].substr(0, 14) === "validate_error") {
						element.output	=	classes[i].replace(/validate_error_/, "");
					}
					if (classes[i].substr(0, 13) === "validate_type") {
						element.type	=	classes[i].replace(/validate_type_/, "");
					}
				}
				
				if ($(this)[0].tagName.toLowerCase() === "input") {
					switch (element.type) {
					case "text":
						if (!element.output) {
							element.output	=	self.options.error_output.text;
						}
						break;
					case "email":
						if (!element.output) {
							element.output	=	self.options.error_output.email;
						}
						break;
					case "checkbox":
						if (!element.output) {
							element.output	=	self.options.error_output.other;
						}
						break;
					case "radio":
						// Make sure only one of the radio boxes is added to the list
						if (!element.output) {
							element.output	=	self.options.error_output.other;
						}
						if ($(this)[0] !== $(self.el).find("input[type=radio][name=" + element.name + "]:last")[0]) {
							element	=	false;
						}
						break;
					}
				
				} else if ($(this)[0].tagName.toLowerCase() === "textarea") {
					
					if (!element.output) {
						element.output	=	self.options.error_output.textarea;
					}
					element.type	=	"textarea";
				
				} else if ($(this)[0].tagName.toLowerCase() === "select") {
				
					if (!element.output) {
						element.output	=	self.options.error_output.select;
					}
					element.type	=	"select";
				
				}
				
				if (!element.output) {
				
					element.output	=	self.options.error_output[element.type];
				
				}
				
				if (element) {
					self.elements.push(element);	
				}
			
			});
			
		};
		
		//
		// validate()
		// Go trough the self.elements list and run the appropriate validation function and if necessary the output function
		//
		self.validate		=	function () {
			
			var i, element, type, output,
			size		=	self.elements.length,
			valid		=	true;
			
			self.alert_message	=	"";
			
			for (i = 0; i < size; i += 1) {
				
				element	=	self.elements[i];
				type	=	self.options.types[element.type];
				output	=	self.options.output[element.output];
				if (type) {
				
					if (!type(element, self)) {
					
						valid			=	false;
						
						if (output) {
						
							output(element, self);
						
						}
					
					}
				
				}
			
			}
			
			if (self.alert_message) {
				alert(self.alert_message);
			}
			
			if (valid) {
				if (self.options.callback) {
					return self.options.callback(self);
				} else {
					return true;
				}
			} else {
				return false;
			}
		
		};
		
		self.set_options(options);
		self.get_elements();
		
		$(self.el).bind("submit", function () {
		
			return self.validate();
		
		});
	
	},
	
	//
	// ValidateInput
	// Validate single input/select/textarea element
	//
	ValidateInput		=	function (element, options) {
		
		var self		=	this;
		self.el			=	element;
		self.alert_message	=	"";
		self.element		=	{};
		
		//
		// The options
		//
		self.options		=	{
			error_attribute:	"title",
			error_output:		{
				text:			"class",
				email:			"class",
				select:			"class",
				other:			"append"
			},
			error_class:		"validate_invalid",
			error_append_char:	" *",
			error_append_class:	"validate_invalid_append",
			error_parent_class:	"validate_invalid_parent",
			//
			// List of types of elements to validate and the function to validate them
			//
			types:			{
				text:			validate_text,
				email:			validate_email,
				select:			validate_select,
				textarea:		validate_text
			},
			//
			// List of output modules and the function to call them
			//
			output:			{
				"class":		output_class,
				inline:			output_inline,
				append:			output_append,
				alert:			output_alert,
				parent:			output_parent
			}
		};
		
		//
		// set_options()
		// Change options send on initialization or by calling $(el).validate(options) after the initial ValidateForm object was initialized for the element
		//
		self.set_options	=	function (options) {
			var types, output;
			if (options) {
				if (options.types) {
					types	=	$.extend({}, self.options.types, options.types);
				}
				if (options.output) {
					output	=	$.extend({}, self.options.output, options.output);
				}
				$.extend(self.options, options);
				if (types) {
					self.options.types	=	types;
				}
				if (output) {
					self.options.output	=	output;
				}
			}
		};
		
		
		//
		// get_element()
		// Create an object of the element being validated
		//
		self.get_element	=	function () {
		
			self.element.el		=	$(self.el);
			self.element.name	=	$(self.el).attr("name");
			self.element.message	=	$(self.el).attr(self.options.error_attribute);
			self.element.type	=	$(self.el).attr("type").toLowerCase();
			
			// Parse classes to find see if the element has a different then default output or type
			var classes	=	$(self.el).attr("class").split(" "),
			size	=	classes.length,
			i;
			for (i = 0; i < size; i += 1) {
				if (classes[i].substr(0, 14) === "validate_error") {
					self.element.output	=	classes[i].replace(/validate_error_/, "");
				}
				if (classes[i].substr(0, 13) === "validate_type") {
					self.element.type	=	classes[i].replace(/validate_type_/, "");
				}
			}
			
			if ($(self.el)[0].tagName.toLowerCase() === "input") {
				switch (self.element.type) {
				case "text":
					if (!self.element.output) {
						self.element.output	=	self.options.error_output.text;
					}
					break;
				case "email":
					if (!self.element.output) {
						self.element.output	=	self.options.error_output.email;
					}
					break;
				}
			
			} else if ($(self.el)[0].tagName.toLowerCase() === "textarea") {
				
				if (!self.element.output) {
					self.element.output	=	self.options.error_output.text;
				}
				self.element.type	=	"textarea";
			
			} else if ($(self.el)[0].tagName.toLowerCase() === "select") {
			
				if (!self.element.output) {
					self.element.output	=	self.options.error_output.select;
				}
				self.element.type	=	"select";
			
			}
			
		};
		
		self.validate		=	function () {
			
			self.alert_message	=	"";
			var valid		=	true,
			element			=	self.element,
			type			=	self.options.types[element.type],
			output			=	self.options.output[element.output];
			if (type) {
			
				if (!type(element, self)) {
				
					valid			=	false;
					
					if (output) {
					
						output(element, self);
					
					}
				
				}
			
			}
			
			if (self.alert_message) {
				alert(self.alert_message);
			}
			
			return valid; 
		
		};
		
		self.set_options(options);
		self.get_element();

	};
	
	//
	// jQuery.fn.validate()
	// Create either a ValidateFrom or a ValidateInput class for an element or pass options/functions to them if called after class was already created
	//
	$.fn.validate	=	function (options) {
		
		var return_data	=	false;
		
		$(this).each(function () {
			
			var el	=	$(this)[0],
			validate;
			
			if ($.data(el, "validate")) {
				if (options) {
					$.data(el, "validate").set_options(options);
				} else {
					return_data	=	$.data(el, "validate");
				}
			} else {
				if (el.tagName.toLowerCase() === "form") {
					$.data(el, "validate", new ValidateForm(el, options));
				} else if (el.tagName.toLowerCase() === "input" || el.tagName.toLowerCase() === "textarea" || el.tagName.toLowerCase() === "select") {
					validate	=	new ValidateInput(el, options);
					
					return_data	=	validate.validate();
				}
			}
			
		});
		
		return return_data;
	
	};

}(jQuery));
