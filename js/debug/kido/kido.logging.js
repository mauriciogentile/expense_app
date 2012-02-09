Kido.prototype.logging = function() {

    var parentKido = this;

    return {
        kido: parentKido,

        writeVerbose: function (data) { write(data, 0); },

        writeInfo: function (data) { write(data, 1); },

        writeWarning: function (data) { write(data, 2); },

        writeError: function (data) { write(data, 3); },

        writeCritical: function (data) { write(data, 4); },

        write: function (data, level) {
            if(!data) throw "'data' argument is requiered.";
            if (!level && level!==0) throw "'level' argument is required.";
            if (!(level>=0 && level<=4)) throw "'level' argument must be an integer number between 0 and 4.";

            return parentKido.send({
                url: "/logging?level=" + level,
                type: "POST",
                data: JSON.stringify(data)
            });
        },

        query: function (query, options) {
            var params = [];
            if (query) params.push("query=" + JSON.stringify(query));
            if (options) params.push("options=" + JSON.stringify(options));

            return parentKido.send({
                url: "/logging" + ((params.length>0) ? ("?" + params.join("&")) : ""),
                type: "GET"
            });
        },

        get: function(since, level, skip, limit) {
            var query = {};
            if (level) query.level = level;

            if (since) {
                if (!(since instanceof Date)) throw "'Since' argument accepts only null or Date values.";
                else  query.dateTime = { $gt: since };
            }

            var options = { $sort: { dateTime: -1 } };
            if (skip) options.$skip = skip;
            if (limit) options.$limit = limit;

            return this.query(query, options);
        },

        clear: function () {
            return parentKido.send({
                url: "/logging",
                type: "DELETE"
            });
        }
    };
};