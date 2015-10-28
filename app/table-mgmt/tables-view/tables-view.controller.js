angular.module('app.table-mgmt')
    .controller('TablesViewCntl', function ($scope, tables, paginatedTableList, $state, globalSpinner) {
        'use strict';

        $scope.openEditDialog = function (table) {
            $state.go('tableMgmt.details', {tableId: table.id});
        };

        $scope.selectedItems = [];
        $scope.maxSize = 5;
        $scope.totalItems = paginatedTableList.pagination.total;
        $scope.numPerPage = paginatedTableList.pagination.size;
        $scope.currentPage = paginatedTableList.pagination.page;

        $scope.gridOptions = {
            data: paginatedTableList.result
        };

        $scope.reloadTables = function () {
            tables.getPaginatedTables($scope.currentPage, $scope.numPerPage).then(function (paginatedTables) {
                return paginatedTables;
            }).then(function (res) {
                paginatedTableList = res;
                $scope.gridOptions.data = paginatedTableList.result;
            });
        };

        $scope.tableStatus = {
            free: true,
            reserved: true,
            occupied: true
        };

        $scope.toggleFilter = function (kind) {
            if(kind === 'all') {
                angular.forEach($scope.tableStatus, function(val, attr) {
                    $scope.tableStatus[attr] = true;
                })
            } else {
                $scope.tableStatus[kind] = !$scope.tableStatus[kind];
            }
            $scope.reloadTables();
        };

        $scope.statusFilter = function (table) {
            return $scope.tableStatus[table.state.toLowerCase()] === true;
        };

        $scope.$watch('currentPage', function () {
            $scope.reloadTables();
        });

        $scope.reserve = function (table) {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return tables.reserve(table).then($scope.reloadTables);
            })
        };

        $scope.release = function (table) {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return tables.free(table).then($scope.reloadTables);
            });
        };

        $scope.occupy = function (table) {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return tables.occupy(table).then($scope.reloadTables);
            });
        };
    });
